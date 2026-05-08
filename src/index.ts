import type {Handler, LambdaFunctionURLEvent, LambdaFunctionURLResult
} from 'aws-lambda';
import type {RequestPayload} from "./models/dto/index.js";
import {buildBadResponse} from "./utils/http.js";
import type {Controller} from "./controllers/index.js";
import {CreateAccountEndpoint} from "./controllers/account/createAccountEndpoint.js";
import {NotFoundEndpoint} from "./controllers/generic/notFoundEndpoint.js";
import {type AccountRepository, D1AccountRepository} from "./services/accountRepository/accountRepository.js";
import {D1DatabaseService} from "./services/d1database/index.js";
import * as process from "node:process";

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

    switch (data.action) {
        case "createAccount":
            endpoint = new CreateAccountEndpoint(accountRepository);
            break;
        default:
            endpoint = new NotFoundEndpoint();
            break;
    }

    return await endpoint.handle(data);
};
