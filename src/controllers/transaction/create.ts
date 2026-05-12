import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {badJson, okJson} from "../../utils/http.js";

export class CreateTransactionEndpoint implements Controller{
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<LambdaFunctionURLResult> {
        if (!data.data.createTransactionData) {
            return badJson("`createTransactionData` is required");
        }

        if (!data.claims?.email) {
            return badJson("email claim is required");
        }

        data.data.createTransactionData.email = data.claims?.email;

        const transactionId = await this.transactionRepository.create({
            ...data.data.createTransactionData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            transactionDate: new Date().toISOString(),
        });

        const getResponse = await this.transactionRepository.get(transactionId);

        if (!getResponse) {
            return badJson("Failed to create transaction");
        }

        return okJson({
            data: {
                createTransactionData: getResponse
            }
        });
    }
}