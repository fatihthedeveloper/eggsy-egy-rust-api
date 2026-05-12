import type {ViewPayload} from "../models/dto/index.js";
import type {LambdaFunctionURLResult} from "aws-lambda";

export interface View{
    render(data: ViewPayload): Promise<LambdaFunctionURLResult>
}