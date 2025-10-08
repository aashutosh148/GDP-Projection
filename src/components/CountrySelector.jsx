import React, { useEffect } from 'react';

const CountrySelector = ({ countries, selectedCountries, onCountrySelect, loading = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm mb-1">
        {loading ? 'Selecting country and generating AI projection…' : 'Select a country'}
      </label>
      <select
        className="bg-gray-800 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onChange={(e) => onCountrySelect(e.target.value)}
        value=""
        disabled={loading}
      >
        <option value="" disabled>{loading ? 'Please wait…' : 'Select a country'}</option>
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