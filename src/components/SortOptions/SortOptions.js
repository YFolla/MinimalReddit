import React from 'react';
import './SortOptions.css';

const SortOptions = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'new', label: 'New' },
    { value: 'top', label: 'Top' },
    { value: 'rising', label: 'Rising' },
  ];

  return (
    <div className="sort-options">
      <div className="sort-buttons">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            className={`sort-button ${currentSort === option.value ? 'active' : ''}`}
            onClick={() => onSortChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortOptions; 