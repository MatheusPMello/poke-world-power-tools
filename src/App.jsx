import React, { useState, useMemo } from 'react';
import { useCreaturesData } from './hooks/useCreaturesData';
import { processPokemons, getTieredPokemons, getAllTypes } from './utils/calculations';
import { useTeam } from './hooks/useTeam';
import { useFilters } from './hooks/useFilters';
import { CLANS } from './utils/constants';
import ControlsPanel from './components/ControlsPanel';
import PokemonList from './components/PokemonList';
import TeamPanel from './components/TeamPanel';
import ErrorBoundary from './components/ErrorBoundary';
import PokemonModal from './components/PokemonModal';
import './index.css';

export default function App() {
  const filters = useFilters();
  const {
    activeFilter,
    rankingMode,
    include600,
    considerCooldown,
    considerSpeed,
    allowTypeOverlap,
    selectedClan,
    restrictToClanElements
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
    let finalPokemons = filteredPokemons;
    
    if (restrictToClanElements && selectedClan !== 'Nenhum') {
      const clanElements = CLANS[selectedClan] || [];
      finalPokemons = finalPokemons.filter(p => {
        const type1 = p.type1?.toUpperCase();
        const type2 = p.type2?.toUpperCase();
        return clanElements.includes(type1) || clanElements.includes(type2);
      });
    }

    // Pass the currently filtered and sorted pokemons to ensure it respects the active Clan & Ranking mode
    autoBuild(finalPokemons, allowTypeOverlap);
  };

  const handleSearchSelect = (pokeId) => {
    // Scroll to the card
    setTimeout(() => {
      const card = document.getElementById(`pokemon-card-${pokeId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a temporary highlight class
        card.classList.add('highlight-card');
        setTimeout(() => {
          card.classList.remove('highlight-card');
        }, 3000);
      }
    }, 100);
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
          pokemons={filteredPokemons}
          onSearchSelect={handleSearchSelect}
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
