// src/context/SidebarContext.js
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [isFilter,setShowFilter] = useState(false)
    const [isDate,setDate] = useState(false)
    const [filterValues, setFilterValues] = useState({
    positions: {},
    universities: {},
    date:''
  });

  const toggleFilter = () => setShowFilter(prev => !prev);

  return (
    <FilterContext.Provider value={{ isDate,setDate,isFilter,toggleFilter,setShowFilter,filterValues,setFilterValues}}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
