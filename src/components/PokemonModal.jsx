import React from 'react';
import { Sword, Shield, Zap, Activity, Heart, Wind, X } from 'lucide-react';
import PokemonImage from './PokemonImage';
import TypeBadges from './TypeBadges';
import './PokemonModal.css';

export default function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  // Stop click propagation when clicking inside the modal content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-premium" onClick={handleContentClick}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header-section">
          <div className="modal-image-container">
            <PokemonImage pokeId={pokemon.pokeId} name={pokemon.name} className="modal-pokemon-image" />
          </div>
          <div className="modal-title-container">
            <h2 className="modal-pokemon-name">{pokemon.name}</h2>
            <span className="modal-pokemon-id">#{String(pokemon.pokeId).padStart(3, '0')}</span>
            <div className="types-container">
              <TypeBadges type1={pokemon.type1} type2={pokemon.type2} />
            </div>
            {pokemon.description && (
              <p className="modal-pokemon-description">{pokemon.description}</p>
            )}
          </div>
        </div>

        <div className="modal-body-section">
          <div className="modal-stats-section">
            <h3>Status Base</h3>
            <div className="stats-grid-6">
              {[
                { label: 'HP', icon: Heart, color: '#ef4444', value: pokemon.baseHp },
                { label: 'Atk', icon: Sword, color: '#f97316', value: pokemon.baseAtk },
                { label: 'Def', icon: Shield, color: '#eab308', value: pokemon.baseDef },
                { label: 'Sp.A', icon: Zap, color: '#3b82f6', value: pokemon.baseSpAtk },
                { label: 'Sp.D', icon: Activity, color: '#8b5cf6', value: pokemon.baseSpDef },
                { label: 'Spd', icon: Wind, color: '#10b981', value: pokemon.baseSpeed }
              ].map(stat => (
                <div key={stat.label} className="stat-item-premium">
                  <span className="stat-label"><stat.icon size={16} color={stat.color} /> {stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-abilities-section">
            <h3>Habilidades</h3>
            <div className="abilities-list">
              {pokemon.attacks && pokemon.attacks.length > 0 ? (
                [...pokemon.attacks]
                  .sort((a, b) => (b.power || 0) - (a.power || 0))
                  .map((attack, index) => (
                  <div key={index} className="ability-card">
                    <div className="ability-header">
                      <span className="ability-name">{attack.name}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span className="type-badge small" style={{ backgroundColor: `var(--type-${attack.type?.toLowerCase()})` }}>
                          {attack.type}
                        </span>
                        {attack.category && (
                          <span className="type-badge small" style={{ backgroundColor: attack.category === 'PHYSICAL' ? '#f97316' : attack.category === 'SPECIAL' ? '#3b82f6' : '#64748b' }}>
                            {attack.category === 'PHYSICAL' ? 'FÍSICO' : attack.category === 'SPECIAL' ? 'ESPECIAL' : attack.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ability-details">
                      <div className="ability-detail-item">
                        <span className="detail-label">Power</span>
                        <span className="detail-value">{attack.power || 0}</span>
                      </div>
                      <div className="ability-detail-item">
                        <span className="detail-label">Cooldown</span>
                        <span className="detail-value">{(attack.cooldownMs / 1000).toFixed(1)}s</span>
                      </div>
                      <div className="ability-detail-item">
                        <span className="detail-label">Level</span>
                        <span className="detail-value">{attack.learnLevel}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-abilities-text">Nenhuma habilidade encontrada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
