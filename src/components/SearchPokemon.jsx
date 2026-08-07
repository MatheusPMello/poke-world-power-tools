import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import PokemonImage from './PokemonImage';

export default function SearchPokemon({ pokemons, onSelect }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filtered = query.trim() === '' 
    ? [] 
    : pokemons.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="search-pokemon-container">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar Pokémon..." 
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="filter-select select-padded"
          style={{ paddingLeft: '32px', minWidth: '200px' }}
        />
      </div>
      
      {isOpen && filtered.length > 0 && (
        <ul className="search-dropdown glass">
          {filtered.map(p => (
            <li 
              key={p.pokeId} 
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                onSelect(p.pokeId);
              }}
              className="search-dropdown-item"
            >
              <PokemonImage pokeId={p.pokeId} name={p.name} className="search-result-img" />
              <span className="search-result-name">{p.name}</span>
              <span className={`tier-badge ${p.tier}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', marginLeft: 'auto' }}>{p.tier}</span>
            </li>
          ))}
        </ul>
      )}
      {isOpen && query.trim() !== '' && filtered.length === 0 && (
        <div className="search-dropdown glass empty" style={{ padding: '0.5rem', textAlign: 'center' }}>
          Nenhum Pokémon encontrado.
        </div>
      )}
    </div>
  );
}
