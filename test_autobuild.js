import fs from 'fs';
import { autoBuildTeam, processPokemons, getTieredPokemons } from './src/utils/calculations.js';

const rawData = JSON.parse(fs.readFileSync('./src/data/creatures.json', 'utf8'));
const processed = processPokemons(rawData.creatures, true, false, false, 'Malefic');
const tiered = getTieredPokemons(processed, 'dps');

try {
  const team = autoBuildTeam(tiered);
  console.log("Team built successfully, length:", team.length);
  console.log(team.map(p => p.name).join(', '));
  
  // Verify if there are any duplicate keys
  const ids = team.map(p => p.pokeId);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    console.error("Duplicate pokeIds found in team:", ids);
  } else {
    console.log("All IDs are unique.");
  }
} catch (e) {
  console.error("Crash during auto build:", e);
}
