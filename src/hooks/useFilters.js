import { useState } from 'react';

export function useFilters() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [rankingMode, setRankingMode] = useState('dps'); // 'dps' or 'balanced'
  const [include600, setInclude600] = useState(true);
  const [considerCooldown, setConsiderCooldown] = useState(false);
  const [considerSpeed, setConsiderSpeed] = useState(false);
  const [allowTypeOverlap, setAllowTypeOverlap] = useState(false);
  const [selectedClan, setSelectedClan] = useState('Nenhum');
  const [restrictToClanElements, setRestrictToClanElements] = useState(false);

  return {
    activeFilter, setActiveFilter,
    rankingMode, setRankingMode,
    include600, setInclude600,
    considerCooldown, setConsiderCooldown,
    considerSpeed, setConsiderSpeed,
    allowTypeOverlap, setAllowTypeOverlap,
    selectedClan, setSelectedClan,
    restrictToClanElements, setRestrictToClanElements
  };
}
