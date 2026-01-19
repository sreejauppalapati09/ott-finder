const API_KEY = '3930c1be5b3fe928ba94e2558376f5a9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const fetchPosterPath = async (title: string, year?: number): Promise<string | null> => {
    const query = encodeURIComponent(title);
    // Using 'multi' search to find both movies and TV shows
    const searchUrl = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`;
    
    try {
        const response = await fetch(searchUrl);
        if (!response.ok) {
            console.error("TMDb API request failed with status:", response.status);
            return null;
        }
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            let bestMatch = data.results[0];

            // If a year is provided, try to find a better match by comparing release years
            if(year) {
                const perfectMatch = data.results.find(r => {
                    const releaseDate = r.release_date || r.first_air_date; // movies use release_date, tv uses first_air_date
                    return releaseDate && new Date(releaseDate).getFullYear() === year;
                });
                if (perfectMatch) {
                    bestMatch = perfectMatch;
                }
            }
            
            // Return the poster path if it exists
            if (bestMatch && bestMatch.poster_path) {
                return `${IMAGE_BASE_URL}${bestMatch.poster_path}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching from TMDb API:", error);
        return null;
    }
};