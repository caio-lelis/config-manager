import React, { useState } from 'react';

const SearchBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    environment: '',
    service: ''
  });

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { environment: '', service: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="search-bar">
      <div className="filter-group">
        <label htmlFor="environment">Ambiente</label>
        <select
          id="environment"
          name="environment"
          value={filters.environment}
          onChange={handleChange}
        >
          <option value="">Todos os ambientes</option>
          <option value="development">Development</option>
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="service">Serviço</label>
        <input
          id="service"
          name="service"
          type="text"
          placeholder="Filtrar por serviço..."
          value={filters.service}
          onChange={handleChange}
        />
      </div>

      {(filters.environment || filters.service) && (
        <button 
          type="button" 
          className="btn-clear"
          onClick={clearFilters}
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
};

export default SearchBar;