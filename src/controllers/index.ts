import type {RequestPayload, ViewPayload} from "../models/dto/index.js";
import type {APIGatewayProxyStructuredResultV2, LambdaFunctionURLResult} from "aws-lambda";

export interface Controller {
    handle(data: RequestPayload): Promise<LambdaFunctionURLResult>
}

