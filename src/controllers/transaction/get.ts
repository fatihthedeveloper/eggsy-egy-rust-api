import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {badJson, okJson} from "../../utils/http.js";

export class GetTransactionEndpoint implements Controller {
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<LambdaFunctionURLResult> {
        if (!data.data.getTransactionData) {
            return badJson("`getTransactionData` is required");
        }

        if (!data.claims?.email) {
            return badJson("email claim is required");
        }

        const {email} = data.claims;

        const transaction = await this.transactionRepository.get(data.data.getTransactionData.id);
        if (!transaction) {
            return badJson("Transaction not found");
        }

        if (transaction.email !== email) {
            return badJson("Transaction not found *");
        }

        return okJson({
            data: {
                getTransactionData: transaction
            }
        })
    }
}