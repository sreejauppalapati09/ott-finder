
import React, { useState, useEffect } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
    countries: string[];
    selectedCountry: string;
    onCountryChange: (country: string) => void;
    genres: string[];
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
    initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
    onSearch, 
    isLoading, 
    countries, 
    selectedCountry, 
    onCountryChange,
    genres,
    selectedGenre,
    onGenreChange,
    initialQuery = '' 
}) => {
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading && query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., The Matrix, Stranger Things..."
                        className="w-full px-6 py-4 pr-12 text-lg bg-gray-800 border-2 border-gray-700 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-500 text-white shadow-xl"
                        disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <button
                    type="submit"
                    className="md:w-auto w-full px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Searching...
                        </div>
                    ) : 'Search'}
                </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in delay-100">
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Region</span>
                    <div className="relative">
                        <select
                            value={selectedCountry}
                            onChange={(e) => onCountryChange(e.target.value)}
                            disabled={isLoading}
                            className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer pr-6 appearance-none"
                            aria-label="Select country"
                        >
                            {countries.map(country => (
                                <option key={country} value={country} className="bg-gray-800">{country}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Genre</span>
                    <div className="relative">
                        <select
                            value={selectedGenre}
                            onChange={(e) => onGenreChange(e.target.value)}
                            disabled={isLoading}
                            className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer pr-6 appearance-none"
                            aria-label="Select genre"
                        >
                            {genres.map(g => (
                                <option key={g} value={g} className="bg-gray-800">{g}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
