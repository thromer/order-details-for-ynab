import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    query,
    where,
} from "firebase/firestore";
import { db, convertTimestamps, prepareForFirestore } from "./firestore";
import { FiTransaction, DocId } from "../models/types";

export class FiTransactionService {
    private static readonly COLLECTION = "fi_transactions";
    private static readonly SCHEMA_VERSION = 1;

    /**
     * Create a new FI transaction
     */
    static async create(
        transaction: Omit<FiTransaction, "id" | "schemaVersion">
    ): Promise<FiTransaction> {
        try {
            const newTransaction: FiTransaction = {
                ...transaction,
                schemaVersion: this.SCHEMA_VERSION,
            };

            const dataToSave = prepareForFirestore(newTransaction);
            const docRef = await addDoc(
                collection(db, this.COLLECTION),
                dataToSave
            );

            return {
                ...newTransaction,
                id: docRef.id,
            };
        } catch (error) {
            console.error("Error creating FI transaction:", error);
            throw error;
        }
    }

    /**
     * Get a FI transaction by its ID
     */
    static async getById(id: DocId): Promise<FiTransaction | null> {
        try {
            const docRef = doc(db, this.COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return {
                ...convertTimestamps<FiTransaction>(
                    docSnap.data() as FiTransaction
                ),
                id: docSnap.id,
            };
        } catch (error) {
            console.error("Error getting FI transaction:", error);
            throw error;
        }
    }

    /**
     * Get FI transactions by account ID
     */
    static async getByAccountId(accountId: DocId): Promise<FiTransaction[]> {
        try {
            const q = query(
                collection(db, this.COLLECTION),
                where("accountId", "==", accountId)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                ...convertTimestamps<FiTransaction>(
                    doc.data() as FiTransaction
                ),
                id: doc.id,
            }));
        } catch (error) {
            console.error(
                "Error getting FI transactions by account ID:",
                error
            );
            throw error;
        }
    }

    /**
     * Get FI transaction by FI transaction ID
     */
    static async getByFiTransactionId(
        fiTransactionId: DocId
    ): Promise<FiTransaction | null> {
        try {
            const q = query(
                collection(db, this.COLLECTION),
                where("fiTransactionId", "==", fiTransactionId)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return {
                ...convertTimestamps<FiTransaction>(
                    doc.data() as FiTransaction
                ),
                id: doc.id,
            };
        } catch (error) {
            console.error(
                "Error getting FI transaction by FI transaction ID:",
                error
            );
            throw error;
        }
    }

    /**
     * Link FI transaction to a merchant order
     */
    static async linkToOrder(id: DocId, orderId: DocId): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION, id);
            await updateDoc(
                docRef,
                prepareForFirestore({
                    orderId,
                })
            );
        } catch (error) {
            console.error("Error linking FI transaction to order:", error);
            throw error;
        }
    }

    /**
     * Update an existing FI transaction
     */
    static async update(
        id: DocId,
        updates: Partial<Omit<FiTransaction, "id" | "schemaVersion">>
    ): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION, id);
            await updateDoc(docRef, prepareForFirestore(updates));
        } catch (error) {
            console.error("Error updating FI transaction:", error);
            throw error;
        }
    }

    /**
     * Find transactions by post date range
     */
    static async findByDateRange(
        startDate: Date,
        endDate: Date
    ): Promise<FiTransaction[]> {
        try {
            const startTimestamp = prepareForFirestore(startDate);
            const endTimestamp = prepareForFirestore(endDate);

            const q = query(
                collection(db, this.COLLECTION),
                where("fiPostDate", ">=", startTimestamp),
                where("fiPostDate", "<=", endTimestamp)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                ...convertTimestamps<FiTransaction>(
                    doc.data() as FiTransaction
                ),
                id: doc.id,
            }));
        } catch (error) {
            console.error(
                "Error finding FI transactions by date range:",
                error
            );
            throw error;
        }
    }
}
