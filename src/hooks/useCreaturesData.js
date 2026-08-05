import { useState, useEffect } from 'react';
import fallbackData from '../data/creatures.json';

const CACHE_KEY = 'pokemonTools_creaturesData';
const TIMESTAMP_KEY = 'pokemonTools_creaturesTimestamp';
const CACHE_DURATION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
// The user provided this URL for fetching the data
const FETCH_URL = '/api/poke-idleworld/game/creatures.json';

export function useCreaturesData() {
  const [creatures, setCreatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);

        if (cachedData && cachedTimestamp) {
          const now = new Date().getTime();
          const age = now - parseInt(cachedTimestamp, 10);

          if (age < CACHE_DURATION_MS) {
            if (isMounted) {
              setCreatures(JSON.parse(cachedData));
              setLoading(false);
            }
            return;
          }
        }

        // Fetch fresh data if no valid cache
        const response = await fetch(FETCH_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // We expect it to return JSON. If it returns HTML, it will throw an error parsing JSON.
        const data = await response.json();
        
        // Handle both possible JSON structures: { creatures: [...] } or just an array [...]
        const creaturesArray = Array.isArray(data.creatures) ? data.creatures : 
                              (Array.isArray(data) ? data : []);

        if (creaturesArray.length === 0) {
           throw new Error("Formato de dados inesperado ou vazio.");
        }

        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(creaturesArray));
        localStorage.setItem(TIMESTAMP_KEY, new Date().getTime().toString());
        
        if (isMounted) {
          setCreatures(creaturesArray);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao buscar dados online, utilizando arquivo local como fallback:", err);
        
        if (isMounted) {
          // Usa o json local caso o fetch ou parse falhe
          const fallbackArray = fallbackData.creatures || fallbackData;
          setCreatures(fallbackArray);
          setError("Usando dados offline local. Falha ao atualizar dados online.");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { creatures, loading, error };
}
