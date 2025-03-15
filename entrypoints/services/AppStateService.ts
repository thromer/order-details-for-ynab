import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
    db,
    convertTimestamps,
    prepareForFirestore,
} from "./firestore";
import { AppState } from "../models/types";

export class AppStateService {
    private static readonly COLLECTION = "app_state";
    private static readonly DOCUMENT_ID = "current";
    private static readonly SCHEMA_VERSION = 1;

    /**
     * Get the current app state
     */
    static async getCurrent(): Promise<AppState | null> {
        try {
            const stateRef = doc(db, this.COLLECTION, this.DOCUMENT_ID);
            const stateDoc = await getDoc(stateRef);

            if (!stateDoc.exists()) {
                return null;
            }

            return convertTimestamps<AppState>(stateDoc.data() as AppState);
        } catch (error) {
            console.error("Error getting app state:", error);
            throw new Error(`Failed to get app state: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Create or update the app state
     */
    static async saveState(
        state: Partial<Omit<AppState, "schemaVersion">>
    ): Promise<AppState> {
        try {
            const stateRef = doc(db, this.COLLECTION, this.DOCUMENT_ID);
            const currentState = await this.getCurrent();

            const newState: AppState = {
                serverKnowledge:
                state.serverKnowledge ?? currentState?.serverKnowledge ?? 0,
                ...(currentState || {}),
                ...state,
                schemaVersion: AppStateService.SCHEMA_VERSION,
            };

            const dataToSave = prepareForFirestore(newState);

            if (!currentState) {
                // Create new document
                await setDoc(stateRef, dataToSave);
            } else {
                // Update existing document
                await updateDoc(stateRef, dataToSave);
            }

            return newState;
        } catch (error) {
            console.error("Error saving app state:", error);
            throw new Error(`Failed to save app state: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
