import { useState } from 'react';

export const useHighlights = () => {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlights, setHighlights] = useState<Record<number, string[]>>({}); // pageIndex -> base64 strings or path data
  
  const toggleHighlighting = () => setIsHighlighting(!isHighlighting);

  return {
    isHighlighting,
    toggleHighlighting,
    highlights,
    setHighlights
  };
};
