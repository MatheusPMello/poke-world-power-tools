import { describe, it, expect } from 'vitest';
import { calculateDamageScore, autoBuildTeam, getTieredPokemons, processPokemons } from './calculations';

describe('calculations.js', () => {
  describe('calculateDamageScore', () => {
    it('returns 0 if pokemon has no attacks', () => {
      const pokemon = { name: 'Magikarp', attacks: [] };
      expect(calculateDamageScore(pokemon)).toBe(0);
    });

    it('calculates correct damage without STAB or Clan bonus', () => {
      const pokemon = {
        baseAtk: 100,
        baseSpAtk: 50,
        type1: 'NORMAL',
        attacks: [
          { power: 50, category: 'PHYSICAL', type: 'FIGHTING' }
        ]
      };
      // Damage = 50 * 100 = 5000
      expect(calculateDamageScore(pokemon, true, false, false, 'Nenhum')).toBe(5000);
    });

    it('applies STAB bonus (1.5x)', () => {
      const pokemon = {
        baseAtk: 100,
        type1: 'FIRE',
        attacks: [
          { power: 50, category: 'PHYSICAL', type: 'FIRE' }
        ]
      };
      // Damage = 50 * 100 * 1.5 = 7500
      expect(calculateDamageScore(pokemon, true, false, false, 'Nenhum')).toBe(7500);
    });

    it('applies Clan bonus (1.3x to stats)', () => {
      const pokemon = {
        baseAtk: 100,
        type1: 'FIRE',
        attacks: [
          { power: 50, category: 'PHYSICAL', type: 'FIGHTING' }
        ]
      };
      // Damage = 50 * (100 * 1.3) = 6500
      expect(calculateDamageScore(pokemon, true, false, false, 'Volcanic')).toBe(6500);
    });

    it('calculates DPS properly with cooldown', () => {
      const pokemon = {
        baseAtk: 100,
        attacks: [
          { power: 50, category: 'PHYSICAL', type: 'NORMAL', cooldownMs: 2000 }
        ]
      };
      // Base damage = 5000
      // DPS = 5000 / (2000/1000) = 2500
      expect(calculateDamageScore(pokemon, true, true, false, 'Nenhum')).toBe(2500);
    });
  });

  describe('autoBuildTeam', () => {
    it('limits team to 6 pokemons', () => {
      const pokemons = Array.from({ length: 10 }, (_, i) => ({ pokeId: i, type1: `TYPE_${i}` }));
      const team = autoBuildTeam(pokemons, false);
      expect(team.length).toBe(6);
    });

    it('prevents type overlap when allowOverlap is false, but fills team if needed', () => {
      const pokemons = [
        { pokeId: 1, type1: 'FIRE' },
        { pokeId: 2, type1: 'FIRE' },
        { pokeId: 3, type1: 'WATER' },
        { pokeId: 4, type1: 'GRASS' },
        { pokeId: 5, type1: 'ELECTRIC' },
        { pokeId: 6, type1: 'BUG' },
        { pokeId: 7, type1: 'POISON' }
      ];
      const team = autoBuildTeam(pokemons, false);
      expect(team.length).toBe(6);
      expect(team.map(p => p.pokeId)).toEqual([1, 3, 4, 5, 6, 7]);
    });

    it('allows type overlap when allowOverlap is true', () => {
      const pokemons = [
        { pokeId: 1, type1: 'FIRE' },
        { pokeId: 2, type1: 'FIRE' },
        { pokeId: 3, type1: 'WATER' }
      ];
      const team = autoBuildTeam(pokemons, true);
      expect(team.length).toBe(3);
    });
  });
});
