import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { logger } from "./logger";

export const withLogging = (
  handler: (
    event: APIGatewayProxyEvent,
    context: Context
  ) => Promise<APIGatewayProxyResult>
) => {
  return async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const requestId = context.awsRequestId;
    const functionName = context.functionName;
    const path = event.path;
    const httpMethod = event.httpMethod;
    const body = event.body;

    logger.info("Lambda Invoked", {
      requestId,
      functionName,
      path,
      httpMethod,
      body,
    });

    try {
      const result = await handler(event, context);

      if (result.statusCode >= 400) {
        logger.error("Lambda Failed", {
          requestId,
          functionName,
          statusCode: result.statusCode,
          body: result.body,
        });
      } else {
        logger.info("Lambda Succeeded", {
          requestId,
          functionName,
          statusCode: result.statusCode,
          body: result.body,
        });
      }

      return result;
    } catch (error) {
      logger.error("Lambda Failed", {
        requestId,
        functionName,
        error,
      });
      throw error;
    }
  };
};
