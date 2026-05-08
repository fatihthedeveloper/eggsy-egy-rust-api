import type {Controller} from "../index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import {buildBadResponse, buildSuccessResponse} from "../../utils/http.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import type {AccountRepository} from "../../services/accountRepository/accountRepository.js";

export class CreateAccountEndpoint implements Controller {
    private accountRepository: AccountRepository;

    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository;
    }

    public async handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2> {
        if (!data.data.createAccountData) {
            return buildBadResponse("`createAccountData` is required");
        }
        const secret = await this.accountRepository.createAccount(data.data.createAccountData.email);

        return buildSuccessResponse({
            createAccountData: {
                success: true,
                message: "Account created successfully",
                secret
            }
        });
    }
}
