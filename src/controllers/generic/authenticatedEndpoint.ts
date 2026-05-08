import type {Controller} from "../index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import type {AccountRepository} from "../../services/accountRepository/accountRepository.js";
import {buildBadResponse} from "../../utils/http.js";

export class AuthenticatedEndpoint implements Controller{
    private readonly internalEndpoint: Controller;
    private readonly accountRepository: AccountRepository;

    constructor(internalEndpoint: Controller, accountRepository: AccountRepository) {
        this.internalEndpoint = internalEndpoint;
        this.accountRepository = accountRepository;
    }

    public async handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2> {
        const token = data.authentication;
        const email = data.email;
        if (!token) {
            return buildBadResponse("No authentication token provided");
        }

        if (!email) {
            return buildBadResponse("No email provided");
        }

        const secret = await this.accountRepository.getAccountSecret(email);
        if (secret !== token) {
            return buildBadResponse("Invalid authentication token");
        }

        return this.internalEndpoint.handle(data);
    }

}