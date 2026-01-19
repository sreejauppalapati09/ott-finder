
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (str: string): string => {
    const jsonStart = str.indexOf('{');
    const jsonEnd = str.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
        return str;
    }

    return str.substring(jsonStart, jsonEnd + 1).trim();
};

export const getAlternativeSuggestions = async (query: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `The user searched for a movie or TV show title: "${query}". 
            It returned no streaming results, possibly due to a typo or slightly incorrect name. 
            Suggest up to 3 correct or highly similar movie/series titles. 
            Return the result in JSON format: { "suggestions": ["Title 1", "Title 2", "Title 3"] }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["suggestions"]
                }
            },
        });

        const json = JSON.parse(response.text);
        return json.suggestions || [];
    } catch (error) {
        console.error("Error getting alternative suggestions:", error);
        return [];
    }
};

export const findStreamingPlatforms = async (query: string, country: string, genre: string = 'All Genres'): Promise<{ result: SearchResult | null; sources: GroundingChunk[] }> => {
    const genreContext = genre !== 'All Genres' ? `The user is specifically looking for content in the **${genre}** genre. If the title "${query}" does not fit this genre, do not return it.` : '';

    const prompt = `
        Act as a master entertainment availability expert. Your task is to find where the movie or series "${query}" can be watched in **${country}**.

        **SEARCH SCOPE & LOGIC:**
        1. **Check Real-Time Data:** Use Google Search to find the CURRENT status of "${query}".
        2. **Determine Status:**
           - **STREAMING:** If it's available on a subscription service (Netflix, Prime, etc.), list them with direct URLs.
           - **COMING SOON:** If it hasn't released on OTT but a date or platform has been announced, identify that.
           - **IN THEATERS:** If it is currently playing in cinemas but not yet on OTT.
        3. **Country Specificity:** Ensure the information is 100% accurate for **${country}**.

        ${genreContext}

        **JSON OUTPUT FORMAT:**
        {
          "title": "Full Official Title",
          "summary": "Brief summary",
          "year": 2024,
          "status": "streaming" | "coming_soon" | "theaters_only" | "unknown",
          "expectedDate": "e.g., Dec 25, 2024 (if known)",
          "expectedPlatform": "e.g., Disney+ (if known)",
          "platforms": [
            {"name": "Platform Name", "url": "Direct Link"}
          ]
        }

        **CRITICAL RULES:**
        - If the movie is not streaming yet but you find news about it coming to a platform soon, set status to "coming_soon".
        - If it's only in theaters, set status to "theaters_only".
        - If the title is completely unknown or non-existent, return "title": null.
        - NEVER return fake links.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
        const rawText = response.text;
        if (!rawText) throw new Error("Empty response from API.");
        
        const cleanedText = cleanJsonString(rawText);

        try {
            const parsedResult: SearchResult = JSON.parse(cleanedText);
            if(parsedResult.title === null) {
                return { result: null, sources: [] };
            }
            return { result: parsedResult, sources };
        } catch (e) {
            console.error("Failed to parse JSON response:", cleanedText);
            throw new Error("Could not understand the search information. The format was unexpected.");
        }
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        throw new Error("Failed to fetch movie information. Please try again later.");
    }
};
