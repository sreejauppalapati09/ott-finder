
import React, { useState, useCallback, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { Loader } from './components/Loader';
import { findStreamingPlatforms, getAlternativeSuggestions } from './services/geminiService';
import { fetchPosterPath } from './services/tmdbService';
import { getBackgroundImage } from './services/backgroundImageService';
import { SearchResult, GroundingChunk } from './types';

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

    useEffect(() => {
        // Preload the image to prevent flickering
        const img = new Image();
        const newBgUrl = getBackgroundImage(country);
        img.src = newBgUrl;
        img.onload = () => {
            setBackgroundUrl(newBgUrl);
        };
    }, [country]);

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setSearchResult(null);
        setSources([]);
        setPosterUrl(null);
        setSearched(true);
        setSuggestions([]);
        setSearchQuery(query);

        try {
            const { result, sources: newSources } = await findStreamingPlatforms(query, country, genre);
            
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
            return <ResultCard result={searchResult} sources={sources} posterUrl={posterUrl} />;
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
