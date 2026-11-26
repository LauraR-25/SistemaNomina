import { useContext } from 'react';
import { LayoutContext } from '../../context/LayoutContext.jsx';

export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('useLayout debe utilizarse dentro de un LayoutProvider.');
  }

  return context;
}

export default useLayout;
