import type {Controller} from "../index.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import {buildBadResponse} from "../../utils/http.js";

export class NotFoundEndpoint implements Controller {
    public async handle(): Promise<APIGatewayProxyStructuredResultV2> {
        return buildBadResponse("Not Found");
    }
}
