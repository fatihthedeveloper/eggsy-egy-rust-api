import type {Handler, LambdaFunctionURLEvent, LambdaFunctionURLResult
} from 'aws-lambda';
import type {RequestPayload} from "./models/dto/index.js";
import {buildBadResponse} from "./utils/http.js";
import type {Controller} from "./controllers/index.js";
import {CreateAccountEndpoint} from "./controllers/account/create.js";
import {NotFoundEndpoint} from "./controllers/generic/notFound.js";
import {type AccountRepository, D1AccountRepository} from "./services/repository/account/index.js";
import {D1DatabaseService} from "./services/database/index.js";
import * as process from "node:process";
import {CreateTransactionEndpoint} from "./controllers/transaction/create.js";
import {
    D1TransactionRepository,
    type TransactionRepository
} from "./services/repository/transaction/index.js";
import {AuthenticatedEndpoint} from "./controllers/generic/authenticated.js";
import {UpdateTransactionEndpoint} from "./controllers/transaction/update.js";
import {GetTransactionEndpoint} from "./controllers/transaction/get.js";
import {ListTransactionEndpoint} from "./controllers/transaction/list.js";
import {DeleteTransactionEndpoint} from "./controllers/transaction/delete.js";

export const handler: Handler<LambdaFunctionURLEvent, LambdaFunctionURLResult> = async (event) => {
    if (!event.body) {
        return buildBadResponse("No body provided");
    }

    const data = JSON.parse(event.body) as RequestPayload;

    let endpoint: Controller;

    const d1DatabaseService: D1DatabaseService = new D1DatabaseService(
        process.env.D1_ACCOUNT_ID!,
        process.env.D1_DATABASE_ID!,
        process.env.D1_ACCOUNT_TOKEN!
    );
    const accountRepository: AccountRepository = new D1AccountRepository(d1DatabaseService);
    const transactionRepository: TransactionRepository = new D1TransactionRepository(d1DatabaseService);

    switch (data.action) {
        case "createAccount":
            endpoint = new CreateAccountEndpoint(accountRepository);
            break;
        case "createTransaction":
            endpoint = new AuthenticatedEndpoint(
                new CreateTransactionEndpoint(transactionRepository),
                accountRepository);
            break;
        case "updateTransaction":
            endpoint = new AuthenticatedEndpoint(
                new UpdateTransactionEndpoint(transactionRepository),
                accountRepository);
            break;
        case "getTransaction":
            endpoint = new AuthenticatedEndpoint(
                new GetTransactionEndpoint(transactionRepository),
                accountRepository);
            break;
        case "listTransaction":
            endpoint = new AuthenticatedEndpoint(
                new ListTransactionEndpoint(transactionRepository),
                accountRepository);
            break;
        case "deleteTransaction":
            endpoint = new AuthenticatedEndpoint(
                new DeleteTransactionEndpoint(transactionRepository),
                accountRepository);
            break;
        default:
            endpoint = new NotFoundEndpoint();
            break;
    }

    return await endpoint.handle(data);
};
