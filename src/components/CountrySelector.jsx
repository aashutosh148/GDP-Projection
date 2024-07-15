import React, { useEffect } from 'react';

const CountrySelector = ({ countries, selectedCountries, onCountrySelect }) => {
  return (
    <div className="mb-4">
      <select
        className="bg-gray-800 text-white p-2 rounded"
        onChange={(e) => onCountrySelect(e.target.value)}
        value=""
      >
        <option value="" disabled>Select a country</option>
        {Object.entries(countries).map(([country, code]) => (
          <option key={code} value={code} disabled={selectedCountries.includes(code)}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;