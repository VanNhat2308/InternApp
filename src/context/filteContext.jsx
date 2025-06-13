// src/context/SidebarContext.js
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [isFilter,setShowFilter] = useState(false)
    const [filterValues, setFilterValues] = useState({
    positions: {},
    universities: {},
    term: "Tất cả",
  });

  const toggleFilter = () => setShowFilter(prev => !prev);

  return (
    <FilterContext.Provider value={{ isFilter,toggleFilter,setShowFilter,filterValues,setFilterValues}}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
