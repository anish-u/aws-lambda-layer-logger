import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { withLogging } from "/opt/nodejs/logger/withLogger";

interface BlogPayload {
  title: string;
  content: string;
}

export const handler = withLogging(async (event) => {
  let body: BlogPayload;

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON body." }),
    };
  }

  const { title, content } = body;

  if (!title || !content) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Title and content are required." }),
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Blog created successfully",
      data: {
        id: Date.now(),
        title,
        content,
      },
    }),
  };
});
