import React from 'react';

export default function PokemonImage({ pokeId, name, className }) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;

  return (
    <img 
      src={imageUrl} 
      alt={name} 
      className={className}
      onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'; }}
    />
  );
}
