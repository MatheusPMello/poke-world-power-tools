import React, { useState, useMemo } from 'react';
import { useCreaturesData } from './hooks/useCreaturesData';
import { processPokemons, getTieredPokemons, getAllTypes } from './utils/calculations';
import { useTeam } from './hooks/useTeam';
import { useFilters } from './hooks/useFilters';
import ControlsPanel from './components/ControlsPanel';
import PokemonList from './components/PokemonList';
import TeamPanel from './components/TeamPanel';
import ErrorBoundary from './components/ErrorBoundary';
import PokemonModal from './components/PokemonModal';
import './index.css';

function App() {
  const filters = useFilters();
  const {
    activeFilter,
    rankingMode,
    include600,
    considerCooldown,
    considerSpeed,
    allowTypeOverlap,
    selectedClan
  } = filters;

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const { team, toggleTeam, clearTeam, autoBuild } = useTeam();
  const { creatures, loading, error } = useCreaturesData();

  // Step 1: Process all pokemons once
  const processedData = useMemo(() => {
    return processPokemons(creatures, include600, considerCooldown, considerSpeed, selectedClan);
  }, [creatures, include600, considerCooldown, considerSpeed, selectedClan]);

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

  if (loading) {
    return (
      <div className="app-container loading-container">
        <div className="loading-text">
          <h2>Carregando dados...</h2>
          <p>Buscando as informações mais recentes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      <header>
        <h1>Poke Idle World Tier List</h1>
        <p className="subtitle">
          Ranking dos melhores Pokémons baseados na sua estatística escolhida!
        </p>
        <ControlsPanel 
          filters={filters} 
          types={types} 
          onAutoBuild={handleAutoBuild} 
        />
      </header>
      
      <main>
        <ErrorBoundary>
          <TeamPanel 
            team={team} 
            clearTeam={clearTeam} 
            toggleTeam={toggleTeam} 
            rankingMode={rankingMode} 
            onPokemonClick={setSelectedPokemon}
          />
          <PokemonList 
            pokemons={filteredPokemons} 
            rankingMode={rankingMode} 
            team={team} 
            toggleTeam={toggleTeam}
            onPokemonClick={setSelectedPokemon}
          />
        </ErrorBoundary>
      </main>

      <PokemonModal 
        pokemon={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </div>
  );
}

export default App;
