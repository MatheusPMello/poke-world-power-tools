import React from 'react';
import PokemonCard from './PokemonCard';

export default function TeamPanel({ team, clearTeam, toggleTeam, rankingMode }) {
  if (!team || team.length === 0) return null;

  const totalPower = team.reduce((sum, p) => sum + (p.activeScore || p.dps || 0), 0);

  return (
    <section className="team-panel">
      <div className="team-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>Seu Time ({team.length}/6)</h2>
          <button 
            className="team-clear-btn"
            onClick={clearTeam}
            title="Limpar Time"
          >
            Limpar
          </button>
        </div>
        <div className="dps-badge team-power-badge">
          Poder Total: {totalPower} PTS
        </div>
      </div>
      <div className="tier-grid">
        {team.map(pokemon => (
          <PokemonCard 
            key={pokemon.pokeId} 
            pokemon={pokemon} 
            rankingMode={rankingMode}
            isInTeam={true}
            toggleTeam={toggleTeam} 
            inTeamPanel={true} 
          />
        ))}
      </div>
    </section>
  );
}
