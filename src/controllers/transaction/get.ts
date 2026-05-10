import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import {buildBadResponse, buildSuccessResponse} from "../../utils/http.js";

export class GetTransactionEndpoint implements Controller {
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2> {
        if (!data.data.getTransactionData) {
            return buildBadResponse("`getTransactionData` is required");
        }

        if (!data.claims?.email) {
            return buildBadResponse("email claim is required");
        }

        const {email} = data.claims;

        const transaction = await this.transactionRepository.get(data.data.getTransactionData.id);
        if (!transaction) {
            return buildBadResponse("Transaction not found");
        }

        if (transaction.email !== email) {
            return buildBadResponse("Transaction not found *");
        }

        return buildSuccessResponse({
            data: {
                getTransactionData: transaction
            }
        })
    }
}