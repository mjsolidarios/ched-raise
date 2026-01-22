
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: resolve(__dirname, '../.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
    console.log("Starting migration...");

    // 1. Get all attendance records
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    console.log(`Found ${attendanceSnapshot.size} attendance records.`);

    // 2. Get all registrations (for lookup)
    const registrationsSnapshot = await getDocs(collection(db, "registrations"));
    const registrations = new Map();
    registrationsSnapshot.docs.forEach(doc => {
        registrations.set(doc.id, doc.data());
    });
    console.log(`Found ${registrations.size} registrations.`);

    // 3. Update attendance records
    let batch = writeBatch(db);
    let count = 0;
    let totalUpdated = 0;

    for (const docSnapshot of attendanceSnapshot.docs) {
        const data = docSnapshot.data();

        if (data.attendeeUid) {
            console.log(`Skipping ${docSnapshot.id}, already has attendeeUid.`);
            continue;
        }

        const regData = registrations.get(data.registrationId);

        if (regData && regData.uid) {
            batch.update(doc(db, "attendance", docSnapshot.id), {
                attendeeUid: regData.uid
            });
            count++;
            console.log(`Queuing update for ${docSnapshot.id} -> UID: ${regData.uid}`);
        } else {
            console.warn(`Warning: Could not find registration or UID for attendance ${docSnapshot.id} (RegID: ${data.registrationId})`);
        }

        if (count >= 400) {
            await batch.commit();
            totalUpdated += count;
            console.log(`Committed batch of ${count} updates.`);
            batch = writeBatch(db);
            count = 0;
        }
    }

    if (count > 0) {
        await batch.commit();
        totalUpdated += count;
        console.log(`Committed final batch of ${count} updates.`);
    }

    console.log(`Migration complete. Updated ${totalUpdated} records.`);
}

migrate().catch(console.error);
