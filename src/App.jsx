import React, { useState, useMemo } from 'react';
import creaturesJson from './data/creatures.json';
import { processPokemons, getTieredPokemons, getAllTypes, CLANS } from './utils/calculations';
import { useTeam } from './hooks/useTeam';
import FilterBar from './components/FilterBar';
import PokemonList from './components/PokemonList';
import TeamPanel from './components/TeamPanel';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [rankingMode, setRankingMode] = useState('dps'); // 'dps' or 'balanced'
  const [include600, setInclude600] = useState(true);
  const [considerCooldown, setConsiderCooldown] = useState(false);
  const [considerSpeed, setConsiderSpeed] = useState(false);
  const [allowTypeOverlap, setAllowTypeOverlap] = useState(false);
  const [selectedClan, setSelectedClan] = useState('Nenhum');
  const { team, setTeam, toggleTeam, autoBuild } = useTeam();

  // Step 1: Process all pokemons once
  const processedData = useMemo(() => {
    return processPokemons(creaturesJson.creatures || [], include600, considerCooldown, considerSpeed, selectedClan);
  }, [include600, considerCooldown, considerSpeed, selectedClan]);

  // Step 2: Sort and assign tiers based on the selected mode
  const pokemons = useMemo(() => {
    return getTieredPokemons(processedData, rankingMode);
  }, [processedData, rankingMode]);

  // Extract types only when the underlying data changes
  const types = useMemo(() => {
    return getAllTypes(processedData);
  }, [processedData]);

  // Step 3: Apply Type filters
  const filteredPokemons = useMemo(() => {
    if (activeFilter === 'Todos') return pokemons;
    return pokemons.filter(p => p.type1 === activeFilter || p.type2 === activeFilter);
  }, [pokemons, activeFilter]);

  const handleAutoBuild = () => {
    // Pass the currently filtered and sorted pokemons to ensure it respects the active Clan & Ranking mode
    autoBuild(filteredPokemons, allowTypeOverlap);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Poke Idle World Tier List</h1>
        <p className="subtitle">
          Ranking dos melhores Pokémons baseados na sua estatística escolhida!
        </p>
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
                onClick={handleAutoBuild}
                style={{ padding: '0.6rem 1.5rem', background: '#3b82f6', border: '1px solid #60a5fa', fontWeight: 'bold' }}
              >
                ✨ Auto-Montar Time
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
      </header>
      
      <main>
        <ErrorBoundary>
          <TeamPanel team={team} setTeam={setTeam} rankingMode={rankingMode} />
          <PokemonList 
            pokemons={filteredPokemons} 
            rankingMode={rankingMode} 
            team={team} 
            setTeam={setTeam} 
          />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
