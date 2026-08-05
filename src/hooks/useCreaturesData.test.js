import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCreaturesData } from './useCreaturesData';

describe('useCreaturesData Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch data successfully and store in cache', async () => {
    const mockCreatures = [{ pokeId: 1, name: 'Pikachu' }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ creatures: mockCreatures })
    });

    const { result } = renderHook(() => useCreaturesData());
    
    // Initially loading
    expect(result.current.loading).toBe(true);
    
    // Wait for hook to finish fetching
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.creatures).toEqual(mockCreatures);
    expect(result.current.error).toBeNull();
    
    // Check if it was stored in localStorage
    const cachedData = localStorage.getItem('pokemonTools_creaturesData');
    expect(JSON.parse(cachedData)).toEqual(mockCreatures);
  });

  it('should use fallback local data on fetch failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));
    // Supress console.error for this expected error test
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useCreaturesData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // It should load the fallback data (which has size > 0)
    expect(result.current.creatures.length).toBeGreaterThan(0);
    expect(result.current.error).toBe('Usando dados offline local. Falha ao atualizar dados online.');
  });
});
