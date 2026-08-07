import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTeam } from './useTeam';


describe('useTeam Hook', () => {
  it('should initialize with an empty team', () => {
    const { result } = renderHook(() => useTeam());
    expect(result.current.team).toEqual([]);
  });

  it('should add a pokemon to the team via toggleTeam', () => {
    const { result } = renderHook(() => useTeam());
    const pokemon = { pokeId: 1, name: 'Bulbasaur' };
    
    act(() => {
      result.current.toggleTeam(pokemon);
    });
    
    expect(result.current.team).toHaveLength(1);
    expect(result.current.team[0]).toEqual(pokemon);
  });

  it('should remove a pokemon from the team if it is already there', () => {
    const { result } = renderHook(() => useTeam());
    const pokemon = { pokeId: 1, name: 'Bulbasaur' };
    
    act(() => {
      result.current.toggleTeam(pokemon);
    });
    act(() => {
      result.current.toggleTeam(pokemon);
    });
    
    expect(result.current.team).toHaveLength(0);
  });

  it('should not allow more than 6 pokemons', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() => useTeam());
    
    act(() => {
      for (let i = 1; i <= 7; i++) {
        result.current.toggleTeam({ pokeId: i, name: `Pokemon ${i}` });
      }
    });
    
    expect(result.current.team).toHaveLength(6);
    expect(alertMock).toHaveBeenCalledWith("Seu time já está cheio (Máximo 6).");
    
    alertMock.mockRestore();
  });

  it('should clear the team via clearTeam', () => {
    const { result } = renderHook(() => useTeam());
    
    act(() => {
      result.current.toggleTeam({ pokeId: 1 });
      result.current.toggleTeam({ pokeId: 2 });
    });
    
    expect(result.current.team).toHaveLength(2);
    
    act(() => {
      result.current.clearTeam();
    });
    
    expect(result.current.team).toHaveLength(0);
  });
});
