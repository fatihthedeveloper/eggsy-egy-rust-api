import type {APIGatewayProxyStructuredResultV2} from "aws-lambda";
import type {ResponsePayload} from "../models/dto/index.js";

export const buildBadResponse: (message: string) => APIGatewayProxyStructuredResultV2 = (message: string) => {
    return {
        statusCode: 500,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message
        })
    }
}

export const buildSuccessResponse: (data: ResponsePayload) => APIGatewayProxyStructuredResultV2 = (data: ResponsePayload) => {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
}
