import type {View} from "../index.js";
import type {ViewPayload} from "../../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {badHtml} from "../../utils/http.js";

export class NotFoundView implements View{
    public async render(_: ViewPayload): Promise<LambdaFunctionURLResult> {
        return badHtml("Invalid Route");
    }
}