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
              <div className="stat-item-premium">
                <span className="stat-label"><Heart size={16} color="#ef4444" /> HP</span>
                <span className="stat-value">{pokemon.baseHp}</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-label"><Sword size={16} color="#f97316" /> Atk</span>
                <span className="stat-value">{pokemon.baseAtk}</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-label"><Shield size={16} color="#eab308" /> Def</span>
                <span className="stat-value">{pokemon.baseDef}</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-label"><Zap size={16} color="#3b82f6" /> Sp.A</span>
                <span className="stat-value">{pokemon.baseSpAtk}</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-label"><Activity size={16} color="#8b5cf6" /> Sp.D</span>
                <span className="stat-value">{pokemon.baseSpDef}</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-label"><Wind size={16} color="#10b981" /> Spd</span>
                <span className="stat-value">{pokemon.baseSpeed}</span>
              </div>
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
                      <span className="type-badge small" style={{ backgroundColor: `var(--type-${attack.type?.toLowerCase()})` }}>
                        {attack.type}
                      </span>
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
