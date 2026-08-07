import React from 'react';
import FilterBar from './FilterBar';
import SearchPokemon from './SearchPokemon';
import { CLANS } from '../utils/constants';

export default function ControlsPanel({ filters, types, onAutoBuild, pokemons, onSearchSelect }) {
  const {
    rankingMode, setRankingMode,
    selectedClan, setSelectedClan,
    activeFilter, setActiveFilter,
    include600, setInclude600,
    considerCooldown, setConsiderCooldown,
    considerSpeed, setConsiderSpeed,
    allowTypeOverlap, setAllowTypeOverlap,
    restrictToClanElements, setRestrictToClanElements,
    includeLegendaries, setIncludeLegendaries
  } = filters;

  const toggleConfigs = [
    { label: "TMs (600+)", state: include600, setter: setInclude600 },
    { label: "Cooldown", state: considerCooldown, setter: setConsiderCooldown },
    { label: "Velocidade", state: considerSpeed, setter: setConsiderSpeed },
    { label: "Permitir Tipos Repetidos", state: allowTypeOverlap, setter: setAllowTypeOverlap },
    { label: "Apenas Clã", state: restrictToClanElements, setter: setRestrictToClanElements },
    { label: "Lendários/Míticos", state: includeLegendaries, setter: setIncludeLegendaries },
  ];

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
              className="filter-select select-padded"
              value={selectedClan}
              onChange={(e) => setSelectedClan(e.target.value)}
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
            className="filter-btn active btn-autobuild"
            onClick={onAutoBuild}
          >
            ✨ Montar Time
          </button>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Buscar:</span>
        <div className="button-group">
          <SearchPokemon pokemons={pokemons} onSelect={onSearchSelect} />
        </div>
      </div>

      <div className="control-group checkbox-group-container">
        {toggleConfigs.map(({ label, state, setter }) => (
          <label key={label} className="checkbox-label small-label">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={state}
                onChange={(e) => setter(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
