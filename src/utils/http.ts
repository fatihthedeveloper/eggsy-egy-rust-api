import type {APIGatewayProxyStructuredResultV2, LambdaFunctionURLResult} from "aws-lambda";
import type {ResponsePayload} from "../models/dto/index.js";

export const badJson: (message: string) => LambdaFunctionURLResult = (message: string) => {
    const finalResponsePayload: ResponsePayload = {
        errorMessage: message,
        success: true
    }

    return {
        statusCode: 500,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(finalResponsePayload)
    }
}

export const okJson: (data: ResponsePayload) => LambdaFunctionURLResult = (data: ResponsePayload) => {
    const finalResponsePayload: ResponsePayload = {
        ...data,
        success: true
    }

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(finalResponsePayload)
    }
}

export const badHtml: (data: string) => LambdaFunctionURLResult = (data: string) => (
    {
        statusCode: 500,
        headers: {
            "Content-Type": "text/html"
        },
        body: `<h1>${data}</h1>`
    }
);

export const okHtml: (data: string) => LambdaFunctionURLResult = (data: string) => (
    {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html"
        },
        body: data
    }
);