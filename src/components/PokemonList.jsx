import React, { useMemo } from 'react';
import PokemonCard from './PokemonCard';

export default function PokemonList({ pokemons, rankingMode, team, setTeam }) {
  const tiers = ['S', 'A', 'B', 'C', 'D'];
  
  // Group pokemons by tier in a single O(N) pass, memoized
  const grouped = useMemo(() => {
    const acc = { S: [], A: [], B: [], C: [], D: [] };
    pokemons.forEach(p => {
      if (acc[p.tier]) {
        acc[p.tier].push(p);
      }
    });
    return acc;
  }, [pokemons]);

  return (
    <div>
      {tiers.map(tier => {
        const tierPokemons = grouped[tier];
        if (tierPokemons.length === 0) return null;
        
        return (
          <section key={tier} className="tier-section">
            <div className="tier-header">
              <div className={`tier-badge ${tier}`}>{tier}</div>
              <h2>Tier {tier}</h2>
            </div>
            
            <div className="tier-grid">
              {tierPokemons.map(pokemon => (
                <PokemonCard 
                  key={pokemon.pokeId} 
                  pokemon={pokemon} 
                  rankingMode={rankingMode} 
                  team={team} 
                  setTeam={setTeam} 
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
