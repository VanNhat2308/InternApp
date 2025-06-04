// src/context/SidebarContext.js
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [isFilter,setShowFilter] = useState(false)

  const toggleFilter = () => setShowFilter(prev => !prev);

  return (
    <FilterContext.Provider value={{ isFilter,toggleFilter,setShowFilter}}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
