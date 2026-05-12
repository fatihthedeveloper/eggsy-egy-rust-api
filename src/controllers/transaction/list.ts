import type {Controller} from "../index.js";
import type {TransactionRepository} from "../../services/repository/transaction/index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {badJson, okJson} from "../../utils/http.js";

export class ListTransactionEndpoint implements Controller{
    private readonly transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public async handle(data: RequestPayload): Promise<LambdaFunctionURLResult> {
        if (!data.data.listTransactionData) {
            return badJson("`listTransactionData` is required");
        }

        if (!data.claims?.email) {
            return badJson("email claim is required");
        }

        const {email} = data.claims;
        const {
            page,
            pageSize,
            startDate,
            endDate,
            category
        } = data.data.listTransactionData;

        const transactions = await this.transactionRepository.list(email, page, pageSize, startDate, endDate, category);

        return okJson({
            data: {
                listTransactionData: transactions
            }
        });
    }
}