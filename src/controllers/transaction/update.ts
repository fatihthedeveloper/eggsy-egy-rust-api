import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import {badJson, okJson} from "../../utils/http.js";
import type {LambdaFunctionURLResult} from "aws-lambda";

export class UpdateTransactionEndpoint implements Controller{
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<LambdaFunctionURLResult> {
        if (!data.data.updateTransactionData) {
            return badJson("`updateTransactionData` is required");
        }

        if (!data.claims?.email) {
            return badJson("email claim is required");
        }

        data.data.updateTransactionData.email = data.claims?.email;

        const oldTransaction = await this.transactionRepository.get(data.data.updateTransactionData.id);

        if (!oldTransaction) {
            return badJson("old Transaction not found");
        }

        await this.transactionRepository.update({
            ...data.data.updateTransactionData,
            updatedAt: Date.now(),
            transactionDate: oldTransaction.transactionDate,
            createdAt: oldTransaction.createdAt
        });

        const newTransaction = await this.transactionRepository.get(data.data.updateTransactionData.id);

        if (!newTransaction) {
            return badJson("Failed to update transaction");
        }

        return okJson({
            data: {
                updateTransactionData: newTransaction
            }
        });
    }
}
