import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {badJson, okJson} from "../../utils/http.js";

export class DeleteTransactionEndpoint implements Controller {
    private readonly transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<LambdaFunctionURLResult> {
        if (!data.data.deleteTransactionData) {
            return badJson("`deleteTransactionData` is required");
        }

        if (!data.claims?.email) {
            return badJson("email claim is required");
        }

        const {email} = data.claims;

        const transaction = await this.transactionRepository.get(data.data.deleteTransactionData.id);
        if (!transaction) {
            return badJson("Transaction not found");
        }

        if (transaction.email !== email) {
            return badJson("Transaction not found *");
        }

        await this.transactionRepository.delete(data.data.deleteTransactionData.id);

        return okJson({
            data: {
                deleteTransactionData: "Successfully deleted transaction"
            }
        });
    }
}