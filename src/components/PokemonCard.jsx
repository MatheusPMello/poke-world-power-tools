import React from 'react';
import { Sword, Shield, Zap, Activity, Minus, Plus } from 'lucide-react';
import PokemonImage from './PokemonImage';
import TypeBadges from './TypeBadges';

export default function PokemonCard({ pokemon, rankingMode, team = [], toggleTeam, inTeamPanel = false, onPokemonClick }) {
  const isInTeam = team.some(p => p.pokeId === pokemon.pokeId);

  const handleToggle = (e) => {
    if (e) e.stopPropagation();
    if (toggleTeam) {
      toggleTeam(pokemon);
    }
  };

  return (
    <div 
      className={`pokemon-card glass ${onPokemonClick ? 'clickable' : ''}`}
      onClick={() => onPokemonClick && onPokemonClick(pokemon)}
    >
      <div className="card-header">
        <div>
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <span className="pokemon-id">#{String(pokemon.pokeId).padStart(3, '0')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button 
            onClick={handleToggle}
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
        <PokemonImage pokeId={pokemon.pokeId} name={pokemon.name} className="pokemon-image" />
        <div className="types-container compact">
          <TypeBadges type1={pokemon.type1} type2={pokemon.type2} />
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
