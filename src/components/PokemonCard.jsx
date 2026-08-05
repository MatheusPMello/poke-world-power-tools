import React from 'react';
import { Sword, Shield, Zap, Activity, Minus, Plus } from 'lucide-react';

export default function PokemonCard({ pokemon, rankingMode, team = [], setTeam, inTeamPanel = false }) {
  // Using pokeapi sprites for better visual quality since local game assets might not be available or are generic.
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokeId}.png`;

  const isInTeam = team.some(p => p.pokeId === pokemon.pokeId);

  const toggleTeam = () => {
    if (isInTeam) {
      setTeam(team.filter(p => p.pokeId !== pokemon.pokeId));
    } else {
      if (team.length >= 6) {
        alert("Seu time já está cheio (Máximo 6).");
        return;
      }
      setTeam([...team, pokemon]);
    }
  };

  return (
    <div className="pokemon-card glass">
      <div className="card-header">
        <div>
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <span className="pokemon-id">#{String(pokemon.pokeId).padStart(3, '0')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button 
            onClick={toggleTeam}
            className={`team-toggle-btn ${isInTeam ? 'remove' : 'add'}`}
            title={isInTeam ? "Remover do time" : "Adicionar ao time"}
          >
            {isInTeam ? <Minus size={16} /> : <Plus size={16} />}
          </button>
          <div className="dps-badge">
            {rankingMode === 'balanced' ? (
              <Shield size={14} className="icon-balanced" />
            ) : (
              <Sword size={14} className="icon-dps" />
            )}
            {pokemon.activeScore} PTS
          </div>
        </div>
      </div>
      
      <div className="card-image-container">
        <img 
          src={imageUrl} 
          alt={pokemon.name} 
          className="pokemon-image"
          onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'; }} // fallback
        />
        <div className="types-container compact">
          {pokemon.type1 && (
            <span className="type-badge" style={{ backgroundColor: `var(--type-${pokemon.type1.toLowerCase()})` }}>
              {pokemon.type1}
            </span>
          )}
          {pokemon.type2 && (
            <span className="type-badge" style={{ backgroundColor: `var(--type-${pokemon.type2.toLowerCase()})` }}>
              {pokemon.type2}
            </span>
          )}
        </div>
      </div>

      <div className="stats-container stats-grid-3">
        <div className="stat-item" title="Attack">
          <span className="stat-label"><Sword size={14} /> Atk</span>
          <span className="stat-value">{pokemon.baseAtk}</span>
        </div>
        <div className="stat-item" title="Special Attack">
          <span className="stat-label"><Zap size={14} /> Sp.A</span>
          <span className="stat-value">{pokemon.baseSpAtk}</span>
        </div>
        <div className="stat-item" title="Secundários">
          <span className="stat-label"><Activity size={14} /> Sec</span>
          <span className="stat-value">{pokemon.secondarySum || 0}</span>
        </div>
      </div>
    </div>
  );
}
