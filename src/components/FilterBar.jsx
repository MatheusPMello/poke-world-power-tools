import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterBar({ types, activeFilter, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-dropdown-container">
      <label className="filter-label">Tipo:</label>
      <div className="custom-select-container" ref={dropdownRef}>
        <button 
          className="custom-select-button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="custom-select-value">
            {activeFilter !== 'Todos' && (
              <span 
                className="type-dot"
                style={{ backgroundColor: `var(--type-${activeFilter.toLowerCase()})` }}
              ></span>
            )}
            {activeFilter === 'Todos' ? 'Todos' : activeFilter}
          </div>
          <ChevronDown size={16} />
        </button>

        {isOpen && (
          <ul className="custom-select-options" role="listbox">
            <li 
              className={`custom-select-option ${activeFilter === 'Todos' ? 'selected' : ''}`}
              onClick={() => {
                onFilterChange('Todos');
                setIsOpen(false);
              }}
              role="option"
              aria-selected={activeFilter === 'Todos'}
            >
              Todos
            </li>
            {types.map(type => (
              <li
                key={type}
                className={`custom-select-option ${activeFilter === type ? 'selected' : ''}`}
                onClick={() => {
                  onFilterChange(type);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={activeFilter === type}
              >
                <span 
                  className="type-dot"
                  style={{ backgroundColor: `var(--type-${type.toLowerCase()})` }}
                ></span>
                {type}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
