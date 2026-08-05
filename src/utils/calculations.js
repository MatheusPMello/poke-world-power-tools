export const CLANS = {
  Nenhum: [],
  Volcanic: ['FIRE'],
  Seavell: ['WATER', 'ICE'],
  Naturia: ['GRASS', 'BUG'],
  Raibolt: ['ELECTRIC'],
  Malefic: ['GHOST', 'POISON', 'DARK'],
  Wingeon: ['FLYING', 'DRAGON'],
  Psycraft: ['PSYCHIC', 'FAIRY'],
  Gardestrike: ['FIGHTING', 'NORMAL'],
  Orebound: ['GROUND', 'ROCK'],
  Ironhard: ['STEEL']
};

export function calculateDamageScore(pokemon, include600 = true, considerCooldown = false, considerSpeed = false, selectedClan = 'Nenhum') {
  if (!pokemon.attacks || pokemon.attacks.length === 0) return 0;
  
  let maxBurst = 0;
  let totalDps = 0;
  
  const clanTypes = CLANS[selectedClan] || [];
  const hasClanBonus = clanTypes.includes(pokemon.type1?.toUpperCase()) || clanTypes.includes(pokemon.type2?.toUpperCase());
  
  pokemon.attacks.forEach(attack => {
    const power = attack.power || 0;
    
    // Ignorar skills com poder 600 se a opção estiver desmarcada
    if (!include600 && power >= 600) return;
    
    let relevantStat = 0;
    if (attack.category === 'SPECIAL') {
      relevantStat = pokemon.baseSpAtk || 0;
    } else {
      relevantStat = pokemon.baseAtk || 0;
    }
    
    // Applica o bônus de Clã (Rank 5 = +30%)
    if (hasClanBonus) {
      relevantStat *= 1.30;
    }
    
    // Dano Potencial Bruto (Poder * Status)
    let damage = power * relevantStat;
    
    // Aplica o bônus de STAB (Same-Type Attack Bonus)
    if (attack.type === pokemon.type1 || attack.type === pokemon.type2) {
      damage *= 1.5;
    }

    // Aplica Cooldown se a opção estiver ativada
    if (considerCooldown && attack.cooldownMs && attack.cooldownMs > 0) {
      // Dano por segundo real
      damage = damage / (attack.cooldownMs / 1000);
    }
    
    totalDps += damage;
    if (damage > maxBurst) {
      maxBurst = damage;
    }
  });
  
  // Se o cooldown estiver ativado, o DPS verdadeiro de um Pokémon em jogos Idle 
  // é a soma do DPS de todas as suas habilidades.
  // Se o cooldown estiver desativado, avaliamos apenas o Burst (golpe mais forte).
  let finalScore = considerCooldown ? totalDps : maxBurst;
  
  // Aplica multiplicador de velocidade ao dano final se a opção estiver ativada
  if (considerSpeed && pokemon.baseSpeed) {
    // Exemplo: 100 de speed = 1.0x (normal), 150 = 1.5x (ataca 50% mais rápido)
    finalScore *= (pokemon.baseSpeed / 100);
  }

  return finalScore;
}

export function processPokemons(creaturesData, include600 = true, considerCooldown = false, considerSpeed = false, selectedClan = 'Nenhum') {
  const validPokemons = creaturesData.filter(p => p.attacks && p.attacks.length > 0 && p.looktype > 0 && p.pokeId < 10000);
  
  // Pass 1: Calcular scores brutos e encontrar os valores máximos para Normalização
  let absoluteMaxDamage = 0;
  let absoluteMaxSurv = 0;

  const rawProcessed = validPokemons.map(p => {
    const rawDamage = calculateDamageScore(p, include600, considerCooldown, considerSpeed, selectedClan);
    
    // Status Secundários base (HP + Def + SpDef). 
    let baseHp = p.baseHp || 0;
    let baseDef = p.baseDef || 0;
    let baseSpDef = p.baseSpDef || 0;
    
    const clanTypes = CLANS[selectedClan] || [];
    const hasClanBonus = clanTypes.includes(p.type1?.toUpperCase()) || clanTypes.includes(p.type2?.toUpperCase());
    
    if (hasClanBonus) {
      baseDef *= 1.30;
      baseSpDef *= 1.30;
      // HP doesn't receive clan bonus according to the user's rules
    }
    
    const rawSurv = baseHp + baseDef + baseSpDef;

    if (rawDamage > absoluteMaxDamage) absoluteMaxDamage = rawDamage;
    if (rawSurv > absoluteMaxSurv) absoluteMaxSurv = rawSurv;

    return {
      ...p,
      rawDamage,
      rawSurv,
      // Guardar a soma secundária para exibição na UI
      secondarySum: Math.round(rawSurv)
    };
  });

  // Pass 2: Aplicar Normalização Min-Max e calcular o Score Equilibrado
  return rawProcessed.map(p => {
    // Normalizar de 0 a 10000 para manter números grandes e bonitos na UI
    const normalizedDamage = absoluteMaxDamage > 0 ? (p.rawDamage / absoluteMaxDamage) * 10000 : 0;
    const normalizedSurv = absoluteMaxSurv > 0 ? (p.rawSurv / absoluteMaxSurv) * 10000 : 0;
    
    const dps = Math.round(normalizedDamage);
    const balancedScore = Math.round((normalizedDamage * 0.7) + (normalizedSurv * 0.3));

    return {
      ...p,
      dps, // 'dps' property is kept for compatibility with existing UI logic, but it represents Normalized Damage now
      balancedScore
    };
  });
}

// Function to sort and assign tiers based on the selected mode
export function getTieredPokemons(processedPokemons, mode = 'dps') {
  // Sort by the selected metric
  const sorted = [...processedPokemons].sort((a, b) => {
    if (mode === 'balanced') return b.balancedScore - a.balancedScore;
    return b.dps - a.dps; // default to 'dps'
  });

  const total = sorted.length;
  if (total === 0) return [];

  return sorted.map((pokemon, index) => {
    const percentile = index / total;
    let tier = 'D';
    
    if (percentile <= 0.05) tier = 'S';       // Top 5%
    else if (percentile <= 0.20) tier = 'A';  // Next 15%
    else if (percentile <= 0.50) tier = 'B';  // Next 30%
    else if (percentile <= 0.80) tier = 'C';  // Next 30%
    else tier = 'D';                          // Bottom 20%
    
    return { ...pokemon, tier, activeScore: mode === 'balanced' ? pokemon.balancedScore : pokemon.dps };
  });
}

export function getAllTypes(creatures) {
  const types = new Set();
  creatures.forEach(p => {
    if (p.type1) types.add(p.type1);
    if (p.type2) types.add(p.type2);
  });
  return Array.from(types).sort();
}

// Smart Auto-Builder that prioritizes rank while preventing type overlaps
export function autoBuildTeam(sortedPokemons, allowOverlap = false) {
  const team = [];
  const usedTypes = new Set();
  
  for (const p of sortedPokemons) {
    if (team.length >= 6) break;
    
    if (allowOverlap) {
      team.push(p);
    } else {
      const type1Overlap = p.type1 && usedTypes.has(p.type1);
      const type2Overlap = p.type2 && usedTypes.has(p.type2);
      
      // Only add if it doesn't share any types with our current team
      if (!type1Overlap && !type2Overlap) {
        team.push(p);
        if (p.type1) usedTypes.add(p.type1);
        if (p.type2) usedTypes.add(p.type2);
      }
    }
  }
  
  // Fallback: If we couldn't find 6 completely unique typed pokemons (rare, but possible with heavy filters)
  // Fill the remaining slots with the absolute highest ranked pokemons available.
  if (team.length < 6) {
    for (const p of sortedPokemons) {
      if (team.length >= 6) break;
      if (!team.some(existing => existing.pokeId === p.pokeId)) {
         team.push(p);
      }
    }
  }
  
  return team;
}
