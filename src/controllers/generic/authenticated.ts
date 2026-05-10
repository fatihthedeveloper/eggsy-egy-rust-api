import type {Controller} from "../index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import type {AccountRepository} from "../../services/repository/account/index.js";
import {buildBadResponse} from "../../utils/http.js";

export class AuthenticatedEndpoint implements Controller{
    private readonly internalEndpoint: Controller;
    private readonly accountRepository: AccountRepository;

    constructor(internalEndpoint: Controller, accountRepository: AccountRepository) {
        this.internalEndpoint = internalEndpoint;
        this.accountRepository = accountRepository;
    }

    public async handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2> {
        const auth = data.authentication;
        if (!auth) {
            return buildBadResponse("No authentication token provided");
        }

        const [email, token] = auth.split("::");

        if (!email || !token) {
            return buildBadResponse("Invalid authentication token");
        }

        const account = await this.accountRepository.get(email);
        if (!account) {
            return buildBadResponse("Account not found");
        }

        const {secret} = account;
        if (secret !== token) {
            return buildBadResponse("Invalid authentication token");
        }

        data.claims = {
            email: account.email
        };

        return this.internalEndpoint.handle(data);
    }

}