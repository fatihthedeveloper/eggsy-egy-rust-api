import type {Controller} from "../index.js";
import type {RequestPayload} from "../../models/dto/index.js";
import {badJson, okJson} from "../../utils/http.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import type {AccountRepository} from "../../services/repository/account/index.js";
import {generateSecret} from "../../utils/secret.js";

export class CreateAccountEndpoint implements Controller {
    private accountRepository: AccountRepository;

    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository;
    }

    public async handle(data: RequestPayload): Promise<LambdaFunctionURLResult> {
        if (!data.data.createAccountData) {
            return badJson("`createAccountData` is required");
        }

        const {email} = data.data.createAccountData;

        const existsResponse = await this.accountRepository.get(email);
        if (existsResponse) {
            return badJson("Account already exists");
        }

        const accountId = await this.accountRepository.create({
            email: email,
            secret: generateSecret(),
            createdAt: Date.now(),
            lastUpdatedAt: Date.now(),
            banned: 0
        });

        const getResponse = await this.accountRepository.get(accountId);

        if (!getResponse) {
            return badJson("Failed to create account");
        }

        const {secret} = getResponse;

        return okJson({
            data: {
                createAccountData: {
                    success: true,
                    message: "Account created successfully",
                    secret: secret,
                }
            }
        });
    }
}
