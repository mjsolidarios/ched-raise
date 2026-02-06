export const schoolsByRegion = [
    // NCR
    "University of the Philippines Diliman",
    "Ateneo de Manila University",
    "De La Salle University",
    "University of Santo Tomas",
    "Polytechnic University of the Philippines",
    "Far Eastern University",
    "Mapúa University",
    "Adamson University",
    "National University",
    "University of the East",
    "Lyceum of the Philippines University",
    "Colegio de San Juan de Letran",
    "Trinity University of Asia",
    "Technological Institute of the Philippines",
    "Philippine Normal University",

    // Visayas
    "University of San Carlos",
    "Silliman University",
    "Central Philippine University",
    "West Visayas State University",
    "University of San Jose-Recoletos",
    "University of the Philippines Visayas",
    "Cebu Institute of Technology - University",
    "University of St. La Salle",
    "Iloilo Science and Technology University",
    "Visayas State University",

    // Mindanao
    "Ateneo de Davao University",
    "Xavier University - Ateneo de Cagayan",
    "Mindanao State University - Iligan Institute of Technology",
    "University of Mindanao",
    "Central Mindanao University",
    "Western Mindanao State University",
    "University of Southeastern Philippines",

    // Luzon (Outside NCR)
    "University of the Philippines Los Baños",
    "Saint Louis University",
    "De La Salle Lipa",
    "University of Baguio",
    "Angeles University Foundation",
    "Bulacan State University",
    "Cavite State University",
    "Pangasinan State University",
    "Bicol University",

    // High Schools (Sample)
    "Philippine Science High School - Main Campus",
    "Manila Science High School",
    "Quezon City Science High School",
    "Rizal High School",
    "Makati Science High School"
];

export const getAllSchools = () => {
    return schoolsByRegion.sort();
};
