import type {Controller} from "../index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import type {AccountRepository} from "../../services/repository/account/index.js";
import {badJson} from "../../utils/http.js";

export class AuthenticatedEndpoint implements Controller{
    private readonly internalEndpoint: Controller;
    private readonly accountRepository: AccountRepository;

    constructor(internalEndpoint: Controller, accountRepository: AccountRepository) {
        this.internalEndpoint = internalEndpoint;
        this.accountRepository = accountRepository;
    }

    public async handle(data: RequestPayload): Promise<LambdaFunctionURLResult> {
        const auth = data.authentication;
        if (!auth) {
            return badJson("No authentication token provided");
        }

        const [email, token] = auth.split("::");

        if (!email || !token) {
            return badJson("Invalid authentication token");
        }

        const account = await this.accountRepository.get(email);
        if (!account) {
            return badJson("Account not found");
        }

        const {secret} = account;
        if (secret !== token) {
            return badJson("Invalid authentication token");
        }

        data.claims = {
            email: account.email
        };

        return this.internalEndpoint.handle(data);
    }

}