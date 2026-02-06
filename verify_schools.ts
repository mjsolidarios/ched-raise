import { getAllSchools } from './src/data/schools';

console.log("Verifying schools list...");
const schools = getAllSchools();

if (schools.length === 0) {
    console.error("FAIL: School list is empty");
    process.exit(1);
}

const uP = schools.find(s => s.includes("University of the Philippines Diliman"));
if (!uP) {
    console.error("FAIL: 'University of the Philippines Diliman' not found in list");
    process.exit(1);
}

console.log(`SUCCESS: Found ${schools.length} schools.`);
console.log("Sample schools:", schools.slice(0, 3));
