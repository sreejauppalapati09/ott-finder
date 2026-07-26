
import Anthropic from '@anthropic-ai/sdk';
import { SearchResult, GroundingChunk } from '../types';

if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set.");
}

// NOTE: This exposes the Anthropic API key in the client-side bundle, the
// same tradeoff the previous Gemini key made in this app. Anyone who opens
// devtools can extract and reuse the key. For production use, proxy this
// call through a small backend instead.
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true });

const MODEL = 'claude-opus-5';

const cleanJsonString = (str: string): string => {
    const jsonStart = str.indexOf('{');
    const jsonEnd = str.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
        return str;
    }

    return str.substring(jsonStart, jsonEnd + 1).trim();
};

const extractText = (content: Anthropic.ContentBlock[]): string =>
    content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('\n');

const extractSources = (content: Anthropic.ContentBlock[]): GroundingChunk[] => {
    const sources: GroundingChunk[] = [];
    for (const block of content) {
        if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
            for (const result of block.content) {
                sources.push({ web: { uri: result.url, title: result.title } });
            }
        }
    }
    return sources;
};

export const getAlternativeSuggestions = async (query: string): Promise<string[]> => {
    try {
        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: `The user searched for a movie or TV show title: "${query}".
                It returned no streaming results, possibly due to a typo or slightly incorrect name.
                Suggest up to 3 correct or highly similar movie/series titles.
                Respond with ONLY a JSON object in this exact format, no other text before or after it: { "suggestions": ["Title 1", "Title 2", "Title 3"] }`,
            }],
        });

        const json = JSON.parse(cleanJsonString(extractText(response.content)));
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
        1. **Check Real-Time Data:** Use web search to find the CURRENT status of "${query}".
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
        - Respond with ONLY the JSON object above, no other text before or after it.
    `;

    try {
        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 4096,
            tools: [{ type: 'web_search_20260209', name: 'web_search' }],
            messages: [{ role: 'user', content: prompt }],
        });

        if (response.stop_reason === 'refusal') {
            throw new Error("The request was declined. Please try a different query.");
        }

        const sources = extractSources(response.content);
        const rawText = extractText(response.content);
        if (!rawText) throw new Error("Empty response from API.");

        const cleanedText = cleanJsonString(rawText);

        try {
            const parsedResult: SearchResult = JSON.parse(cleanedText);
            if (parsedResult.title === null) {
                return { result: null, sources: [] };
            }
            return { result: parsedResult, sources };
        } catch (e) {
            console.error("Failed to parse JSON response:", cleanedText);
            throw new Error("Could not understand the search information. The format was unexpected.");
        }
    } catch (error) {
        console.error("Error fetching from Claude API:", error);
        throw new Error("Failed to fetch movie information. Please try again later.");
    }
};
