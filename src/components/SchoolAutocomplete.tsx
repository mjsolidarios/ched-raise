
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { getSchoolSuggestions } from '@/lib/gemini';
import { getAllSchools } from '@/data/schools';
import { Loader2, GraduationCap, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchoolAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    name?: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export function SchoolAutocomplete({ value, onChange, id, name, placeholder, className, required }: SchoolAutocompleteProps) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isOfflineMode, setIsOfflineMode] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const shouldFetchRef = useRef(true);

    // Simple debounce implementation inside to avoid dependencies if hook missing
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [inputValue]);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const filterOfflineSchools = (query: string) => {
        const allSchools = getAllSchools();
        const lowerQuery = query.toLowerCase();
        return allSchools.filter(school => school.toLowerCase().includes(lowerQuery)).slice(0, 5);
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedValue.length < 3) {
                setSuggestions([]);
                return;
            }

            if (!shouldFetchRef.current) {
                return;
            }

            // Heuristic for strict equality check to avoid fetching
            if (suggestions.includes(debouncedValue)) {
                return;
            }

            setLoading(true);

            // If already in offline mode, just filter locally
            if (isOfflineMode) {
                setSuggestions(filterOfflineSchools(debouncedValue));
                setShowSuggestions(true);
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching suggestions for:", debouncedValue);
                const results = await getSchoolSuggestions(debouncedValue);
                console.log("Suggestions received:", results);
                setSuggestions(results);
                if (results.length > 0) {
                    setShowSuggestions(true);
                } else {
                    // If API returns empty but no error, it might just be no match
                    // We can opt to fallback to local search if we want to be helpful, 
                    // or just show "No schools found"
                    // keeping as is for now: let it show "No schools found"
                }
            } catch (error) {
                console.error("Failed to fetch suggestions, switching to offline mode", error);
                setIsOfflineMode(true);
                setSuggestions(filterOfflineSchools(debouncedValue));
                setShowSuggestions(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedValue, isOfflineMode]);

    useEffect(() => {
        // Handle clicks outside
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        shouldFetchRef.current = true; // User is typing, allow fetching
        // We open suggestions immediately to show loading if needed, or previous results?
        // Actually best to wait for debounce to trigger load
    };

    const handleSelect = (school: string) => {
        shouldFetchRef.current = false; // Prevent fetch on this update
        setInputValue(school);
        onChange(school);
        setShowSuggestions(false);
        setSuggestions([]); // Clear suggestions to prevent reopening immediately with old data
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* w-full ensures it takes full width of container */}
            <div className="relative">
                <Input
                    id={id}
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder || "Type university or college name..."}
                    className={cn("pr-10", className)}
                    onFocus={() => {
                        if (inputValue.length >= 3) setShowSuggestions(true);
                    }}
                    autoComplete="off"
                    required={required}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isOfflineMode ? (
                        <div title="Offline Mode - Manual Search">
                            <WifiOff className="h-4 w-4 opacity-50 text-orange-500" />
                        </div>
                    ) : (
                        <GraduationCap className="h-4 w-4 opacity-50" />
                    )}
                </div>
            </div>

            {showSuggestions && (
                <ul className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-ring/5 space-y-1">
                    {loading && suggestions.length === 0 && (
                        <li className="px-2 py-2 text-sm text-muted-foreground text-center">Loading suggestions...</li>
                    )}

                    {!loading && suggestions.length === 0 && debouncedValue.length >= 3 && (
                        <li className="px-2 py-2 text-sm text-muted-foreground text-center">
                            Our AI is busy at the moment...
                            <br />
                            <span className="text-xs">Please type the full name to add it manually.</span>
                        </li>
                    )}

                    {suggestions.map((school, index) => (
                        <li
                            key={index}
                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            onClick={() => handleSelect(school)}
                        >
                            {school}
                        </li>
                    ))}
                    {suggestions.length > 0 && (
                        <li className="px-2 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-t mt-1 bg-muted/20 text-center">
                            {isOfflineMode ? "Offline Suggestions" : "Suggested Schools"}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
