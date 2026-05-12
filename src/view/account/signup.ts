import type {View} from "../index.js";
import type {ViewPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {badHtml, okHtml} from "../../utils/http.js";
import {generateSecret} from "../../utils/secret.js";
import type {AccountRepository} from "../../services/repository/account/index.js";

export class SignupView implements View {
    private accountRepository: AccountRepository;

    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository;
    }

    private readonly SIGNUP_VIEW_HTML: string = `
        <h1>Signup</h1>
        <form action="" method="get">
            <input type="hidden" name="route" value="signup">
            <input type="email" name="email" placeholder="Email" required>
            <button type="submit">Signup</button>
        </form>
    `

    private readonly SIGNUP_SUCCESS_VIEW_HTML: string = `
        <h1>Signup Success!</h1>
        <p>Email: {{email}}</p>
        <p>Secret: {{secret}}</p>
    `;

    public async render(data: ViewPayload): Promise<LambdaFunctionURLResult> {
        if (!data.email) {
            return okHtml(this.SIGNUP_VIEW_HTML);
        }

        const {email} = data;

        const existsResponse = await this.accountRepository.get(email);
        if (existsResponse) {
            return badHtml("Account already exists");
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
            return badHtml("Failed to create account");
        }

        const {secret} = getResponse;

        let html = this.SIGNUP_SUCCESS_VIEW_HTML;
        html = html.replace("{{email}}", email);
        html = html.replace("{{secret}}", secret);

        return okHtml(html);
    }
}