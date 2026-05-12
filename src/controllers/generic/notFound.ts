import type {Controller} from "../index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";
import {badJson} from "../../utils/http.js";

export class NotFoundEndpoint implements Controller {
    public async handle(): Promise<LambdaFunctionURLResult> {
        return badJson("Invalid Route");
    }
}
