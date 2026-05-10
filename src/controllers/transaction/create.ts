import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import {buildBadResponse, buildSuccessResponse} from "../../utils/http.js";

export class CreateTransactionEndpoint implements Controller{
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2> {
        if (!data.data.createTransactionData) {
            return buildBadResponse("`createTransactionData` is required");
        }

        if (!data.claims?.email) {
            return buildBadResponse("email claim is required");
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
            return buildBadResponse("Failed to create transaction");
        }

        return buildSuccessResponse({
            data: {
                createTransactionData: getResponse
            }
        });
    }
}