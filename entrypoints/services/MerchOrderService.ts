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
import { MerchOrder, DocId } from "../models/types";

export class MerchOrderService {
    private static readonly COLLECTION = "merch_orders";
    private static readonly SCHEMA_VERSION = 1;

    /**
     * Create a new merchant order
     */
    static async create(
        order: Omit<MerchOrder, "id" | "schemaVersion">
    ): Promise<MerchOrder> {
        try {
            const newOrder: MerchOrder = {
                ...order,
                schemaVersion: this.SCHEMA_VERSION,
            };

            const dataToSave = prepareForFirestore(newOrder);
            const docRef = await addDoc(
                collection(db, this.COLLECTION),
                dataToSave
            );

            return {
                ...newOrder,
                id: docRef.id,
            };
        } catch (error) {
            console.error("Error creating merchant order:", error);
            throw error;
        }
    }

    /**
     * Get a merchant order by its ID
     */
    static async getById(id: DocId): Promise<MerchOrder | null> {
        try {
            const docRef = doc(db, this.COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return {
                ...convertTimestamps<MerchOrder>(docSnap.data() as MerchOrder),
                id: docSnap.id,
            };
        } catch (error) {
            console.error("Error getting merchant order:", error);
            throw error;
        }
    }

    /**
     * Get merchant orders by merchant ID
     */
    static async getByMerchantId(merchantId: DocId): Promise<MerchOrder[]> {
        try {
            const q = query(
                collection(db, this.COLLECTION),
                where("merchantId", "==", merchantId)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                ...convertTimestamps<MerchOrder>(doc.data() as MerchOrder),
                id: doc.id,
            }));
        } catch (error) {
            console.error(
                "Error getting merchant orders by merchant ID:",
                error
            );
            throw error;
        }
    }

    /**
     * Get a merchant order by order ID
     */
    static async getByOrderId(orderId: DocId): Promise<MerchOrder | null> {
        try {
            const q = query(
                collection(db, this.COLLECTION),
                where("orderId", "==", orderId)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return {
                ...convertTimestamps<MerchOrder>(doc.data() as MerchOrder),
                id: doc.id,
            };
        } catch (error) {
            console.error("Error getting merchant order by order ID:", error);
            throw error;
        }
    }

    /**
     * Update an existing merchant order
     */
    static async update(
        id: DocId,
        updates: Partial<Omit<MerchOrder, "id" | "schemaVersion">>
    ): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION, id);
            await updateDoc(docRef, prepareForFirestore(updates));
        } catch (error) {
            console.error("Error updating merchant order:", error);
            throw error;
        }
    }

    /**
     * Find orders by date range
     */
    static async findByDateRange(
        startDate: Date,
        endDate: Date
    ): Promise<MerchOrder[]> {
        try {
            const startTimestamp = prepareForFirestore(startDate);
            const endTimestamp = prepareForFirestore(endDate);

            const q = query(
                collection(db, this.COLLECTION),
                where("merchOrderDate", ">=", startTimestamp),
                where("merchOrderDate", "<=", endTimestamp)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                ...convertTimestamps<MerchOrder>(doc.data() as MerchOrder),
                id: doc.id,
            }));
        } catch (error) {
            console.error(
                "Error finding merchant orders by date range:",
                error
            );
            throw error;
        }
    }
}
