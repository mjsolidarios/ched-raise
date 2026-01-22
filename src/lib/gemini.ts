
export async function getSchoolSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 3) return [];

    try {
        console.log("Fetching school suggestions from PHP API for:", query);

        const response = await fetch('/src/api/ai/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'suggestion',
                query: query
            })
        });

        if (!response.ok) {
            console.error("PHP API Error:", response.status, response.statusText);
            return [];
        }

        const data = await response.json();
        const text = data.text; // PHP returns { text: "..." }

        if (!text) {
            console.warn("PHP API returned empty text.");
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
            if (cleanText.includes('\n')) {
                return cleanText.split('\n').map((line: string) => line.replace(/^- /, '').trim()).slice(0, 5);
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
        console.error("School Suggestions Error:", error);
        return [];
    }
}
