import type {Handler, LambdaFunctionURLEvent, LambdaFunctionURLResult
} from 'aws-lambda';
import type {RequestPayload, ViewPayload} from "./models/dto/index.js";
import {badJson} from "./utils/http.js";
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
import type {View} from "./view/index.js";
import {HomeView} from "./view/home/index.js";
import {NotFoundView} from "./view/generic/notFound.js";
import {SignupView} from "./view/account/signup.js";

const viewHandler: Handler<LambdaFunctionURLEvent, LambdaFunctionURLResult> = async (event) => {
    if (!event.queryStringParameters) {
        return badJson("No query parameters provided");
    }

    let {route} = event.queryStringParameters;
    if (!route) {
        route = "home"
    }

    const data = JSON.parse(JSON.stringify(event.queryStringParameters)) as ViewPayload;

    let view: View;

    const d1DatabaseService: D1DatabaseService = new D1DatabaseService(
        process.env.D1_ACCOUNT_ID!,
        process.env.D1_DATABASE_ID!,
        process.env.D1_ACCOUNT_TOKEN!
    );
    const accountRepository: AccountRepository = new D1AccountRepository(d1DatabaseService);

    switch (route) {
        case "home":
            view = new HomeView();
            break;
        case "signup":
            view = new SignupView(accountRepository);
            break;
        default:
            view = new NotFoundView();
            break;
    }

    return (await view.render(data))!;
}

const postHandler: Handler<LambdaFunctionURLEvent, LambdaFunctionURLResult> = async (event) => {
    if (!event.body) {
        return badJson("No body provided");
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

    return (await endpoint.handle(data))!;
};

export const handler: Handler<LambdaFunctionURLEvent, LambdaFunctionURLResult> = (event, context, callback) => {
    if (event.requestContext.http.method == "POST") {
        return postHandler(event, context, callback);
    }

    return viewHandler(event, context, callback);
}
