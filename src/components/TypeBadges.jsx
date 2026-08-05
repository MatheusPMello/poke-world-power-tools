import React from 'react';

export default function TypeBadges({ type1, type2 }) {
  return (
    <>
      {type1 && (
        <span className="type-badge" style={{ backgroundColor: `var(--type-${type1.toLowerCase()})` }}>
          {type1}
        </span>
      )}
      {type2 && (
        <span className="type-badge" style={{ backgroundColor: `var(--type-${type2.toLowerCase()})` }}>
          {type2}
        </span>
      )}
    </>
  );
}
