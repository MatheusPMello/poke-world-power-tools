import { useState, useCallback } from 'react';
import { autoBuildTeam } from '../utils/calculations';

export function useTeam() {
  const [team, setTeam] = useState([]);

  const toggleTeam = useCallback((pokemon) => {
    setTeam(prevTeam => {
      const isInTeam = prevTeam.some(p => p.pokeId === pokemon.pokeId);
      if (isInTeam) {
        return prevTeam.filter(p => p.pokeId !== pokemon.pokeId);
      } else {
        if (prevTeam.length >= 6) {
          alert("Seu time já está cheio (Máximo 6).");
          return prevTeam;
        }
        return [...prevTeam, pokemon];
      }
    });
  }, []);

  const clearTeam = useCallback(() => {
    setTeam([]);
  }, []);

  const autoBuild = useCallback((filteredPokemons, allowTypeOverlap) => {
    const newTeam = autoBuildTeam(filteredPokemons, allowTypeOverlap);
    setTeam(newTeam);
  }, []);

  return {
    team,
    setTeam,
    toggleTeam,
    clearTeam,
    autoBuild
  };
}
