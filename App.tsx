
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { Loader } from './components/Loader';
import { FavoritesList } from './components/FavoritesList';
import { findStreamingPlatforms, getAlternativeSuggestions } from './services/geminiService';
import { fetchPosterPath } from './services/tmdbService';
import { getBackgroundImage } from './services/backgroundImageService';
import { getFavorites, toggleFavorite, removeFavorite } from './services/favoritesService';
import { SearchResult, GroundingChunk, FavoriteItem } from './types';

const countries = [
    'United States', 'India', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Japan', 'Brazil', 'Mexico', 'Spain', 'South Korea'
];

const genres = [
    'All Genres', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 
    'Romance', 'Documentary', 'Animation', 'Thriller', 'Mystery', 'Crime'
];

const App: React.FC = () => {
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [posterUrl, setPosterUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState<boolean>(false);
    const [country, setCountry] = useState<string>('United States');
    const [genre, setGenre] = useState<string>('All Genres');
    const [backgroundUrl, setBackgroundUrl] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [view, setView] = useState<'search' | 'favorites'>('search');
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    useEffect(() => {
        // Preload the image to prevent flickering
        const img = new Image();
        const newBgUrl = getBackgroundImage(country);
        img.src = newBgUrl;
        img.onload = () => {
            setBackgroundUrl(newBgUrl);
        };
    }, [country]);

    const handleSearch = useCallback(async (query: string, overrides?: { country?: string; genre?: string }) => {
        if (!query.trim()) return;

        const effectiveCountry = overrides?.country ?? country;
        const effectiveGenre = overrides?.genre ?? genre;

        setIsLoading(true);
        setError(null);
        setSearchResult(null);
        setSources([]);
        setPosterUrl(null);
        setSearched(true);
        setSuggestions([]);
        setSearchQuery(query);
        if (overrides?.country && overrides.country !== country) setCountry(overrides.country);
        if (overrides?.genre && overrides.genre !== genre) setGenre(overrides.genre);

        try {
            const { result, sources: newSources } = await findStreamingPlatforms(query, effectiveCountry, effectiveGenre);

            if (result && result.title) {
                setSearchResult(result);
                setSources(newSources);
                const url = await fetchPosterPath(result.title, result.year);
                setPosterUrl(url);
            } else {
                // Fetch suggestions if no results found
                const altSuggestions = await getAlternativeSuggestions(query);
                setSuggestions(altSuggestions);
            }

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [country, genre]);

    const currentIsFavorite = useMemo(() => {
        if (!searchResult) return false;
        return favorites.some(f =>
            f.title.toLowerCase() === searchResult.title.toLowerCase() && f.year === searchResult.year
        );
    }, [favorites, searchResult]);

    const handleToggleFavorite = useCallback(() => {
        if (!searchResult) return;
        const updated = toggleFavorite({
            title: searchResult.title,
            year: searchResult.year,
            country,
            posterUrl,
            status: searchResult.status,
        });
        setFavorites(updated);
    }, [searchResult, posterUrl, country]);

    const handleSelectFavorite = useCallback((item: FavoriteItem) => {
        setView('search');
        handleSearch(item.title, { country: item.country, genre: 'All Genres' });
    }, [handleSearch]);

    const handleRemoveFavorite = useCallback((title: string, year: number) => {
        setFavorites(removeFavorite(title, year));
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return <div className="text-center text-red-400 mt-8 bg-red-900/50 p-4 rounded-lg">{error}</div>;
        }
        if (searched && !searchResult) {
            return (
                <div className="flex flex-col items-center gap-6 mt-8">
                    <div className="text-center text-gray-400 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 w-full">
                        <p className="text-lg">No streaming results found for "<span className="text-gray-200 font-semibold">{searchQuery}</span>" {genre !== 'All Genres' ? `in the ${genre} genre` : ''}.</p>
                        <p className="mt-2 text-sm">The title might not be available in {country}, it might not match the selected genre, or there might be a typo.</p>
                    </div>
                    
                    {suggestions.length > 0 && (
                        <div className="text-center animate-fade-in">
                            <h3 className="text-gray-400 mb-4 font-medium uppercase tracking-wider text-sm">Did you mean?</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSearch(suggestion)}
                                        className="px-6 py-2 bg-gray-800 border border-purple-500/30 hover:border-purple-500 text-purple-400 rounded-full transition-all duration-300 hover:bg-purple-500/10 active:scale-95"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        if (searchResult) {
            return (
                <ResultCard
                    result={searchResult}
                    sources={sources}
                    posterUrl={posterUrl}
                    isFavorite={currentIsFavorite}
                    onToggleFavorite={handleToggleFavorite}
                />
            );
        }
        return (
            <div className="text-center text-gray-400 mt-8">
                <p className="text-lg">Find where to watch your favorite movies and series.</p>
                <p>Enter a title above to begin.</p>
            </div>
        );
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-fixed text-white font-sans transition-all duration-1000"
            style={{ 
                backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
                backgroundColor: '#111827' // Corresponds to bg-gray-900
            }}
        >
            <div className="min-h-screen w-full bg-gray-900/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center my-8 md:my-12">
                         <div className="inline-block bg-gradient-to-r from-cyan-400 to-purple-600 p-1 rounded-xl">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gray-900 px-4 py-2 rounded-lg">
                                OTT Finder
                            </h1>
                        </div>
                        <p className="text-gray-400 mt-4 text-md md:text-lg">
                            Your universal remote for streaming services.
                        </p>
                    </header>

                    <main>
                        <div className="flex justify-center gap-3 mb-8">
                            <button
                                onClick={() => setView('search')}
                                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 border ${
                                    view === 'search'
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white'
                                }`}
                            >
                                Search
                            </button>
                            <button
                                onClick={() => setView('favorites')}
                                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 border flex items-center gap-2 ${
                                    view === 'favorites'
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white'
                                }`}
                            >
                                Favorites
                                {favorites.length > 0 && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-black/20">{favorites.length}</span>
                                )}
                            </button>
                        </div>

                        {view === 'search' ? (
                            <>
                                <SearchBar
                                    onSearch={handleSearch}
                                    isLoading={isLoading}
                                    countries={countries}
                                    selectedCountry={country}
                                    onCountryChange={setCountry}
                                    genres={genres}
                                    selectedGenre={genre}
                                    onGenreChange={setGenre}
                                    initialQuery={searchQuery}
                                />
                                <div className="mt-10">
                                    {renderContent()}
                                </div>
                            </>
                        ) : (
                            <FavoritesList
                                favorites={favorites}
                                onSelect={handleSelectFavorite}
                                onRemove={handleRemoveFavorite}
                            />
                        )}
                    </main>
                     <footer className="text-center text-gray-500 mt-16 text-sm">
                        <p>Powered by Google Gemini &amp; The Movie DB</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default App;
