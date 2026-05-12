import type {View} from "../index.js";
import type {ViewPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {okHtml} from "../../utils/http.js";

export class HomeView implements View{

    private readonly HOME_VIEW_HTML: string = `
        <h1>Welcome To EGGSY!</h1>
        <p>EGGSY is a transaction/expense tracker app!</p>
        <a href="?route=signup">SignUp</a>
    `;

    public async render(_: ViewPayload): Promise<LambdaFunctionURLResult> {
        return okHtml(this.HOME_VIEW_HTML);
    }
}
