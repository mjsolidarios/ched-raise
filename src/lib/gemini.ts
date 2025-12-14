
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("Gemini API Key is missing! Autocomplete will not work.");
}

export async function getSchoolSuggestions(query: string): Promise<string[]> {
    if (!genAI) {
        console.warn("Gemini API not initialized.");
        return [];
    }
    if (!query || query.length < 3) return [];

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `List 5 Philippine universities or colleges that match this partial name: "${query}". Return ONLY a valid JSON array of strings. Example: ["School A", "School B"]. NO markdown.`;

        console.log("Sending prompt to Gemini:", prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Raw Response:", text);

        if (!text) {
            console.warn("Gemini returned empty text.");
            return [];
        }

        // Sanitize and parse
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstBracket = cleanText.indexOf('[');
        const lastBracket = cleanText.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanText = cleanText.substring(firstBracket, lastBracket + 1);
        } else {
            console.warn("Could not find JSON array brackets in response.");
            // Fallback: try to split by newlines if it returned a list
            if (cleanText.includes('\n')) {
                return cleanText.split('\n').map(line => line.replace(/^- /, '').trim()).slice(0, 5);
            }
            return [];
        }

        try {
            const suggestions = JSON.parse(cleanText);
            if (Array.isArray(suggestions)) {
                return suggestions.slice(0, 5);
            }
        } catch (jsonError) {
            console.error("JSON Parse Error:", jsonError, "Cleaned Text:", cleanText);
        }

        return [];
    } catch (error) {
        console.error("Gemini Autocomplete Error (Details):", error);
        return [];
    }
}
