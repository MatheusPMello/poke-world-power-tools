import React from 'react';
import FilterBar from './FilterBar';
import { CLANS } from '../utils/constants';

export default function ControlsPanel({ filters, types, onAutoBuild }) {
  const {
    rankingMode, setRankingMode,
    selectedClan, setSelectedClan,
    activeFilter, setActiveFilter,
    include600, setInclude600,
    considerCooldown, setConsiderCooldown,
    considerSpeed, setConsiderSpeed,
    allowTypeOverlap, setAllowTypeOverlap
  } = filters;

  return (
    <div className="control-panel glass">
      <div className="control-group">
        <span className="control-label">Modo de Ranking:</span>
        <div className="button-group">
          <button
            className={`filter-btn ${rankingMode === 'dps' ? 'active' : ''}`}
            onClick={() => setRankingMode('dps')}
          >
            🔥 Dano Máximo
          </button>
          <button
            className={`filter-btn ${rankingMode === 'balanced' ? 'active' : ''}`}
            onClick={() => setRankingMode('balanced')}
          >
            🛡️ Equilibrado
          </button>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Clã (Rank 5):</span>
        <div className="button-group">
          <div className="filter-dropdown-container">
            <select
              className="filter-select"
              value={selectedClan}
              onChange={(e) => setSelectedClan(e.target.value)}
              style={{ padding: '0.6rem 2.5rem 0.6rem 1rem' }}
            >
              {Object.keys(CLANS).map(clan => (
                <option key={clan} value={clan}>{clan}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Filtros de Tipo:</span>
        <div className="button-group">
          <FilterBar
            types={types}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">&nbsp;</span>
        <div className="button-group">
          <button
            className="filter-btn active"
            onClick={onAutoBuild}
            style={{ padding: '0.6rem 1.5rem', background: '#a78bfa', border: '1px solid #c4b5fd', fontWeight: 'bold' }}
          >
            ✨ Montar Time
          </button>
        </div>
      </div>

      <div className="control-group checkbox-group-container">
        <label className="checkbox-label small-label">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={include600}
              onChange={(e) => setInclude600(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          TMs (600+)
        </label>
        <label className="checkbox-label small-label">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={considerCooldown}
              onChange={(e) => setConsiderCooldown(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          Cooldown
        </label>
        <label className="checkbox-label small-label">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={considerSpeed}
              onChange={(e) => setConsiderSpeed(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          Velocidade
        </label>
        <label className="checkbox-label small-label">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={allowTypeOverlap}
              onChange={(e) => setAllowTypeOverlap(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          Permitir Tipos Repetidos
        </label>
      </div>
    </div>
  );
}
