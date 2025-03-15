import {
    API,
    GetTransactionsTypeEnum,
    TransactionsApi,
    TransactionsResponse,
} from "ynab";
import { Temporal } from "temporal-polyfill";

export interface TransactionDetailStorage {
    getTransactionDetailState(
        id: string
    ): Promise<TransactionDetailState | null>;
    saveTransactionDetailState(
        id: string,
        state: TransactionDetailState
    ): Promise<void>;
    getServerKnowledge(): Promise<number | null>;
    saveServerKnowledge(knowledge: number): Promise<void>;
}

export interface YnabApiClient {
    getTransactions(
        budgetId: string,
        sinceDate?: string,
        type?: string,
        lastKnowledgeOfServer?: number
    ): Promise<TransactionsResponse>;
}

export class RealYnabApiClient implements YnabApiClient {
    private transactionsApi: TransactionsApi;

    constructor(accessToken: string) {
        const ynabAPI = new API(accessToken);
        this.transactionsApi = ynabAPI.transactions;
    }

    async getTransactions(
        budgetId: string,
        sinceDate?: string,
        type?: GetTransactionsTypeEnum,
        lastKnowledgeOfServer?: number
    ): Promise<TransactionsResponse> {
        return this.transactionsApi.getTransactions(
            budgetId,
	    sinceDate,
	    type,
            lastKnowledgeOfServer
        );
    }
}

export enum TransactionDetailState {
    HAVE_DETAILS = "HAVE_DETAILS",
    FAILED_TO_GET_DETAILS = "FAILED_TO_GET_DETAILS",
    NEED_DETAILS = "NEED_DETAILS",
}

export class YnabAnalyzer {
    private static DEFAULT_DATE_LIMIT_DAYS = 90;

    constructor(
        private ynabClient: YnabApiClient,
        private detailStorage: TransactionDetailStorage,
        private budgetId: string
    ) {}

    /**
     * Analyzes YNAB transactions to find those needing more details.
     *
     * @param sinceDate If provided, only transactions since this date will be analyzed.
     * @param overrideDefaultDateLimit If true, analyze all transactions regardless     *                                of date. If false (default) and no sinceDate or
     *                                server knowledge is available, only transactions
     *                                from the last 90 days will be analyzed.
     * @returns The number of transactions newly identified as needing details.
     */
    async analyzeTransactions(
        sinceDate?: Temporal.PlainDate,
        overrideDefaultDateLimit = false
    ): Promise<number> {
        const lastKnowledgeOfServer =
            await this.detailStorage.getServerKnowledge();

        let effectiveSinceDate = sinceDate;

        // If we don't have server knowledge and no sinceDate is provided, use default date limit
        // unless overridden
        if (
            !lastKnowledgeOfServer &&
            !effectiveSinceDate &&
            !overrideDefaultDateLimit
        ) {
            const defaultDate = Temporal.Now.plainDateISO().subtract({
                days: YnabAnalyzer.DEFAULT_DATE_LIMIT_DAYS,
            });
            effectiveSinceDate = defaultDate;
        }

        const transactionsResponse = await this.ynabClient.getTransactions(
            this.budgetId,
            effectiveSinceDate?.toString(),
            undefined,
            lastKnowledgeOfServer || undefined
        );

        const transactions = transactionsResponse.data.transactions;
        const newServerKnowledge = transactionsResponse.data.server_knowledge;

        let transactionsNeedingDetailsCount = 0;
        for (const transaction of transactions) {
            if (transaction.deleted) {
                continue;
            }

            const existingState =
                await this.detailStorage.getTransactionDetailState(
                    transaction.id
                );
            if (!existingState) {
                transactionsNeedingDetailsCount++;
                await this.detailStorage.saveTransactionDetailState(
                    transaction.id,
                    TransactionDetailState.NEED_DETAILS
                );
            }
        }
        await this.detailStorage.saveServerKnowledge(newServerKnowledge);

        return transactionsNeedingDetailsCount;
    }

    // To do later, not right now:
    // * decide on the actual storage schema
    // * move helpers to their own files (we'll use them from other modules)
    // * tests
}
