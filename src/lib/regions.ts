export const PHILIPPINE_REGIONS = [
    "National Capital Region (NCR)",
    "Cordillera Administrative Region (CAR)",
    "Region I (Ilocos Region)",
    "Region II (Cagayan Valley)",
    "Region III (Central Luzon)",
    "Region IV-A (CALABARZON)",
    "Region IV-B (MIMAROPA)",
    "Region V (Bicol Region)",
    "Region VI (Western Visayas)",
    "Region VII (Central Visayas)",
    "Region VIII (Eastern Visayas)",
    "Region IX (Zamboanga Peninsula)",
    "Region X (Northern Mindanao)",
    "Region XI (Davao Region)",
    "Region XII (SOCCSKSARGEN)",
    "Region XIII (Caraga)",
    "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)"
];

export const getRegionShortName = (region: string | undefined): string => {
    if (!region) return '';

    // Specialized mapping for regions to their requested short forms
    const shortNames: Record<string, string> = {
        "National Capital Region (NCR)": "NCR",
        "Cordillera Administrative Region (CAR)": "CAR",
        "Region I (Ilocos Region)": "Region I",
        "Region II (Cagayan Valley)": "Region II",
        "Region III (Central Luzon)": "Region III",
        "Region IV-A (CALABARZON)": "Region IV-A",
        "Region IV-B (MIMAROPA)": "Region IV-B",
        "Region V (Bicol Region)": "Region V",
        "Region VI (Western Visayas)": "Region VI",
        "Region VII (Central Visayas)": "Region VII",
        "Region VIII (Eastern Visayas)": "Region VIII",
        "Region IX (Zamboanga Peninsula)": "Region IX",
        "Region X (Northern Mindanao)": "Region X",
        "Region XI (Davao Region)": "Region XI",
        "Region XII (SOCCSKSARGEN)": "Region XII",
        "Region XIII (Caraga)": "Region XIII",
        "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)": "BARMM"
    };

    return shortNames[region] || region; // Return mapped name or original if not found
};
