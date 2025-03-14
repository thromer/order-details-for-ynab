import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
    DocumentReference,
    CollectionReference,
    FirestoreDataConverter,
} from "firebase/firestore";

import {
    AppState,
    AppTransaction,
    FiTransaction,
    MerchOrder,
    DocId,
    AppTransactionSyncState,
} from "../models/types";

// Initialize Firebase (replace with your config)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper to convert Firestore timestamps to Date
export const convertTimestamps = <T>(data: any): T => {
    const result = { ...data };

    // Convert Firestore timestamps to JavaScript Date objects
    Object.keys(result).forEach((key) => {
        if (result[key] instanceof Timestamp) {
            result[key] = result[key].toDate();
        } else if (result[key] && typeof result[key] === "object") {
            result[key] = convertTimestamps(result[key]);
        }
    });

    return result as T;
};

// Helper to convert Dates to Firestore timestamps
export const prepareForFirestore = <T>(data: T): any => {
    const result = { ...(data as any) };

    // Convert Date objects to Firestore timestamps
    Object.keys(result).forEach((key) => {
        if (result[key] instanceof Date) {
            result[key] = Timestamp.fromDate(result[key]);
        } else if (
            result[key] &&
            typeof result[key] === "object" &&
            !(result[key] instanceof Timestamp)
        ) {
            result[key] = prepareForFirestore(result[key]);
        }
    });

    return result;
};
