import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { withLogging } from "/opt/nodejs/logger/withLogger";

export const handler = withLogging(async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        message: "Blogs fetched successfully",
        blogs: [
          {
            id: 1,
            title: "Blog 1",
            content: "Content 1",
          },
          {
            id: 2,
            title: "Blog 2",
            content: "Content 2",
          },
        ],
      },
    }),
  };
});
