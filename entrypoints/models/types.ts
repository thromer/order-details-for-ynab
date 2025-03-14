// Basic types
export type DocId = string;
export type PlainDate = Date;

// Enum for transaction sync state
export enum AppTransactionSyncState {
    UNKNOWN = "UNKNOWN",
    NOT_NEEDED = "NOT_NEEDED",
    NEEDS_SYNC = "NEEDS_SYNC",
    SUCCEEDED = "SUCCEEDED",
    NEEDS_RETRY = "NEEDS_RETRY",
    FAILED = "FAILED",
}

// Base interface for all documents
export interface BaseDocument {
    schemaVersion: number;
}

// App State
export interface AppState extends BaseDocument {
    serverKnowledge: number;
}

// App Transaction
export interface AppTransaction extends BaseDocument {
    id?: DocId;
    applicationId: DocId;
    accountId: DocId;
    transactionId?: DocId; // Our ID for the transaction; optional until sync succeeds
    applicationSyncState: AppTransactionSyncState;

    // App-specific fields
    appAccountId: DocId;
    appTransactionId: DocId;
    appFiMerchTransactionId?: DocId; // the FI's record of the merchant's id
    appPostDate: PlainDate;
    appAmountMills: number;
}

// Financial Institution Transaction
export interface FiTransaction extends BaseDocument {
    id?: DocId;
    accountId: DocId;
    orderId?: DocId;

    // FI-specific fields
    fiTransactionId: DocId;
    fiPostDate: PlainDate;
    fiAmountMills: number;
}

// Merchant Order
export interface MerchOrder extends BaseDocument {
    id?: DocId;
    merchantId: DocId;
    orderId: DocId;
    merchOrderDate: PlainDate;
}
