import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import {buildBadResponse, buildSuccessResponse} from "../../utils/http.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";

export class UpdateTransactionEndpoint implements Controller{
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2> {
        if (!data.data.updateTransactionData) {
            return buildBadResponse("`updateTransactionData` is required");
        }

        if (!data.claims?.email) {
            return buildBadResponse("email claim is required");
        }

        data.data.updateTransactionData.email = data.claims?.email;

        const oldTransaction = await this.transactionRepository.get(data.data.updateTransactionData.id);

        if (!oldTransaction) {
            return buildBadResponse("old Transaction not found");
        }

        await this.transactionRepository.update({
            ...data.data.updateTransactionData,
            updatedAt: Date.now(),
            transactionDate: oldTransaction.transactionDate,
            createdAt: oldTransaction.createdAt
        });

        const newTransaction = await this.transactionRepository.get(data.data.updateTransactionData.id);

        if (!newTransaction) {
            return buildBadResponse("Failed to update transaction");
        }

        return buildSuccessResponse({
            data: {
                updateTransactionData: newTransaction
            }
        });
    }
}
