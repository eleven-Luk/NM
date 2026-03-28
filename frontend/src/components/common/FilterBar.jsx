// components/common/FilterBar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFire, faTimes } from '@fortawesome/free-solid-svg-icons';

const FilterBar = ({
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search...",
    
    // Filter dropdown
    filterOptions = [],
    filterValue = '',
    onFilterChange,
    filterPlaceholder = "All",

    // Filter inquiry
    filterInquiryOptions = [],
    filterInquiryValue = '',
    onFilterInquiryChange,
    filterInquiryPlaceholder = "All",

    
    // Status inquiry
    filterStatusOptions = [],
    filterStatusValue = '',
    onFilterStatusChange,
    filterStatusPlaceholder = "All",

    // Filter Type
    filterTypeOptions = [],
    filterTypeValue = '',
    onFilterTypeChange,
    filterTypePlaceholder = "All",

    // Filter Setup
    filterSetupOptions = [],
    filterSetupValue = '',
    onFilterSetupChange,
    filterSetupPlaceholder = "All",
    
    
    // Special filters
    showSpecialFilter = false,
    specialFilterLabel = "",
    specialFilterIcon = faFire,
    onSpecialFilterClick,
    isSpecialFilterActive = false,
    
    // Results count
    resultsCount = 0,
    resultsLabel = "ITEMS",
    
    // Refresh
    onRefresh,
    
    // Active filters display
    activeFilters = [],
    onClearFilters,
    
    // Additional buttons
    extraButtons = null
}) => {
    const isFiltered = searchTerm || filterValue !== 'all' || isSpecialFilterActive || activeFilters.length > 0;

    return (
        <div className="space-y-4 p-4">
            {/* Search and Refresh Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder={searchPlaceholder}
                            className="pl-10 pr-4 py-2 border border-orange-200 text-orange-800 font-light focus:border-orange-400 focus:outline-none transition-colors w-64"
                        />
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" 
                        />
                    </div>

                    {/* Filter Dropdown */}
                    {filterOptions.length > 0 && (
                        <select 
                            value={filterValue}
                            onChange={onFilterChange}
                            className="px-4 py-2 border border-orange-200 text-orange-800 font-light focus:border-orange-400 focus:outline-none transition-colors"
                        >
                            <option value="all">{filterPlaceholder}</option>
                            {filterOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                    {/* Filter Dropdown */}
                    {filterInquiryOptions.length > 0 && (
                        <select 
                            value={filterInquiryValue}
                            onChange={onFilterInquiryChange}
                            className="px-4 py-2 border border-orange-200 text-orange-800 font-light focus:border-orange-400 focus:outline-none transition-colors"
                        >
                            <option value="all">{filterInquiryPlaceholder}</option>
                            {filterInquiryOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Filter Setup */}
                    {filterSetupOptions.length > 0 && (
                        <select 
                            value={filterSetupValue}
                            onChange={onFilterSetupChange}
                            className="px-4 py-2 border border-orange-200 text-orange-800 font-light focus:border-orange-400 focus:outline-none transition-colors"
                        >
                            <option value="all">{filterSetupPlaceholder}</option>
                            {filterSetupOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Filter Status */}
                    {filterStatusOptions.length > 0 && (
                        <select 
                            value={filterStatusValue}
                            onChange={onFilterStatusChange}
                            className="px-4 py-2 border border-orange-200 text-orange-800 font-light focus:border-orange-400 focus:outline-none transition-colors"
                        >
                            <option value="all">{filterStatusPlaceholder}</option>
                            {filterStatusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}


                    {/* Filter Type Dropdown */}
                    {filterTypeOptions.length > 0 && (
                        <select 
                            value={filterTypeValue}
                            onChange={onFilterTypeChange}
                            className="px-4 py-2 border border-orange-200 text-orange-800 font-light focus:border-orange-400 focus:outline-none transition-colors"
                        >
                            <option value="all">{filterTypePlaceholder}</option>
                            {filterTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Special Filter Button */}
                    {showSpecialFilter && (
                        <button
                            onClick={onSpecialFilterClick}
                            className={`px-4 py-2 text-xs font-light tracking-wider border transition-all duration-300 flex items-center gap-2 ${
                                isSpecialFilterActive
                                    ? 'border-orange-500 bg-orange-500 text-white'
                                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800'
                            }`}
                        >
                            <FontAwesomeIcon 
                                icon={specialFilterIcon} 
                                className={`text-xs ${isSpecialFilterActive ? 'text-white' : 'text-orange-500'}`} 
                            />
                            {specialFilterLabel}
                        </button>
                    )}

                    {/* Results Count */}
                    <p className="text-sm text-orange-400 font-light">
                        {resultsCount} {resultsCount === 1 ? resultsLabel.slice(0, -1) : resultsLabel} FOUND
                    </p>

                    {/* Extra Buttons */}
                    {extraButtons}
                </div>

                {/* Refresh Button */}
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="text-xs text-orange-400 hover:text-orange-600 transition-colors font-light tracking-wider"
                    >
                        REFRESH
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {isFiltered && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400 font-light">FILTERING BY:</span>
                    
                    {searchTerm && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-light border border-gray-200">
                            SEARCH: "{searchTerm}"
                        </span>
                    )}
                    
                    {filterValue !== 'all' && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-light border border-gray-200">
                            {filterOptions.find(opt => opt.value === filterValue)?.label || filterValue.toUpperCase()}
                        </span>
                    )}
                    
                    {isSpecialFilterActive && specialFilterLabel && (
                        <span className="px-2 py-1 bg-gray-100 text-orange-600 text-xs font-light border border-orange-200">
                            {specialFilterLabel}
                        </span>
                    )}
                    
                    {activeFilters.map((filter, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-light border border-gray-200">
                            {filter.label}
                        </span>
                    ))}
                    
                    {onClearFilters && (
                        <button
                            onClick={onClearFilters}
                            className="px-2 py-1 text-xs font-light tracking-wider text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                            CLEAR ALL
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterBar;