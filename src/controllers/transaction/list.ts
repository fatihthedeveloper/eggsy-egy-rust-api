import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import {buildBadResponse, buildSuccessResponse} from "../../utils/http.js";

export class ListTransactionEndpoint implements Controller{
    private readonly transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2> {
        return buildBadResponse("error");
    }
}