import { db } from './firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp,
    deleteDoc,
    doc
} from 'firebase/firestore';

export interface AttendanceRecord {
    id?: string;
    registrationId: string;
    ticketCode: string;
    timestamp: Timestamp;
    method: 'scan' | 'manual';
    scannedBy: string;
    attendeeName: string;
    attendeeEmail?: string;
    status: 'confirmed' | 'pending' | 'rejected';
}

export interface AttendanceStats {
    total: number;
    confirmed: number;
    pending: number;
    rejected: number;
    scanned: number;
    manual: number;
}

/**
 * Record attendance for a registrant
 */
export async function recordAttendance(
    ticketCode: string,
    method: 'scan' | 'manual',
    scannedBy: string
): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> {
    try {
        // Find the registration by ticketCode or id
        const registrationsRef = collection(db, 'registrations');
        const q = query(
            registrationsRef,
            where('ticketCode', '==', ticketCode)
        );

        let snapshot = await getDocs(q);

        // If not found by ticketCode, try by id
        if (snapshot.empty) {
            const q2 = query(registrationsRef, where('__name__', '==', ticketCode));
            snapshot = await getDocs(q2);
        }

        if (snapshot.empty) {
            return {
                success: false,
                message: 'Registration not found. Please check the ID and try again.'
            };
        }

        const regDoc = snapshot.docs[0];
        const regData = regDoc.data();

        // Check if registration is confirmed
        if (regData.status !== 'confirmed') {
            return {
                success: false,
                message: `Registration status is "${regData.status}". Only confirmed registrations can check in.`
            };
        }

        // Check if already recorded attendance
        const attendanceRef = collection(db, 'attendance');
        const existingQuery = query(
            attendanceRef,
            where('registrationId', '==', regDoc.id)
        );
        const existingSnapshot = await getDocs(existingQuery);

        if (!existingSnapshot.empty) {
            const existingRecord = existingSnapshot.docs[0].data();
            return {
                success: false,
                message: `Attendance already recorded on ${existingRecord.timestamp.toDate().toLocaleString()}`
            };
        }

        // Create attendance record
        const attendanceRecord: Omit<AttendanceRecord, 'id'> = {
            registrationId: regDoc.id,
            ticketCode: regData.ticketCode || regDoc.id,
            timestamp: Timestamp.now(),
            method,
            scannedBy,
            attendeeName: `${regData.firstName || ''} ${regData.middleName ? regData.middleName.charAt(0) + '.' : ''} ${regData.lastName || ''}`.trim(),
            attendeeEmail: regData.email,
            status: regData.status
        };

        const docRef = await addDoc(attendanceRef, attendanceRecord);

        return {
            success: true,
            message: `Welcome, ${attendanceRecord.attendeeName}! Attendance recorded successfully.`,
            record: { ...attendanceRecord, id: docRef.id }
        };
    } catch (error) {
        console.error('Error recording attendance:', error);
        return {
            success: false,
            message: 'Failed to record attendance. Please try again.'
        };
    }
}

/**
 * Get all attendance records
 */
export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
        const attendanceRef = collection(db, 'attendance');
        const q = query(attendanceRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as AttendanceRecord));
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        return [];
    }
}

/**
 * Check if attendance has been recorded for a ticket code
 */
export async function checkAttendance(ticketCode: string): Promise<AttendanceRecord | null> {
    try {
        // First find the registration
        const registrationsRef = collection(db, 'registrations');
        const q = query(registrationsRef, where('ticketCode', '==', ticketCode));
        let snapshot = await getDocs(q);

        if (snapshot.empty) {
            const q2 = query(registrationsRef, where('__name__', '==', ticketCode));
            snapshot = await getDocs(q2);
        }

        if (snapshot.empty) {
            return null;
        }

        const regDoc = snapshot.docs[0];

        // Check attendance
        const attendanceRef = collection(db, 'attendance');
        const attendanceQuery = query(
            attendanceRef,
            where('registrationId', '==', regDoc.id)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);

        if (attendanceSnapshot.empty) {
            return null;
        }

        const doc = attendanceSnapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        } as AttendanceRecord;
    } catch (error) {
        console.error('Error checking attendance:', error);
        return null;
    }
}

/**
 * Get attendance statistics
 */
export async function getAttendanceStats(): Promise<AttendanceStats> {
    try {
        const records = await getAttendanceRecords();

        return {
            total: records.length,
            confirmed: records.filter(r => r.status === 'confirmed').length,
            pending: records.filter(r => r.status === 'pending').length,
            rejected: records.filter(r => r.status === 'rejected').length,
            scanned: records.filter(r => r.method === 'scan').length,
            manual: records.filter(r => r.method === 'manual').length
        };
    } catch (error) {
        console.error('Error getting attendance stats:', error);
        return {
            total: 0,
            confirmed: 0,
            pending: 0,
            rejected: 0,
            scanned: 0,
            manual: 0
        };
    }
}

/**
 * Delete attendance records for a specific registration
 * Used when a registration is cancelled/deleted
 */
export async function deleteAttendanceForRegistration(registrationId: string): Promise<void> {
    try {
        const attendanceRef = collection(db, 'attendance');
        const q = query(attendanceRef, where('registrationId', '==', registrationId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return;

        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log(`Deleted ${snapshot.size} attendance records for registration ${registrationId}`);
    } catch (error) {
        console.error('Error deleting attendance for registration:', error);
        // We don't throw here to avoid blocking the main registration deletion flow
    }
}

/**
 * Delete a specific attendance record by ID
 */
export async function deleteAttendanceRecord(recordId: string): Promise<{ success: boolean; message: string }> {
    try {
        await deleteDoc(doc(db, 'attendance', recordId));
        return { success: true, message: 'Attendance record deleted successfully' };
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        return { success: false, message: 'Failed to delete attendance record' };
    }
}
