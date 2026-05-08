import type {RequestPayload} from "../models/dto/index.js";
import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";

export interface Controller {
    handle(data: RequestPayload): Promise<APIGatewayProxyStructuredResultV2>
}
