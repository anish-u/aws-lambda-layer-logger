# AWS Lambda Logging Layer with CDK (TypeScript)

This project demonstrates how to build and deploy a reusable logging layer for AWS Lambda using **TypeScript**, **AWS CDK**, and **Node.js Lambda Layers**. It includes two Lambda functions (`createBlog`, `getBlogs`) that use the shared logging logic via a Lambda Layer.

---

## 🔧 Features

- **Reusable Lambda Layer** for logging and error tracking
- **Higher-order function wrapper** (`withLogger`) for structured logs
- **Type-safe** using AWS Lambda types (`APIGatewayProxyEvent`, etc.)
- **CDK-defined infrastructure** (Lambdas, Layer, API Gateway)
- Clean, scalable project structure

---

## 📁 Project Structure

```
.
├── bin/                            # CDK app entry point
│   └── aws-lambda-layer-logger.ts
├── stacks/                         # CDK Stack
│   └── aws-lambda-layer-logger-stack.ts
├── src/
│   ├── lambdas/                    # Lambda functions
│   │   ├── createBlog.ts
│   │   └── getBlogs.ts
│   └── layers/
│       └── logger/                 # Shared logging Layer
│           ├── logger.ts
│           ├── withLogger.ts
│           ├── package.json
│           └── tsconfig.json
├── package.json
├── tsconfig.json
└── cdk.json
```

---

## 🚀 Usage

### 1. Install dependencies

```bash
npm install
```

### 2. Build the logging layer (from `src/layers/logger/`)

```bash
cd src/layers/logger
npm install     # If using dependencies
npm run build   # Compile TypeScript to JS (outputs to dist/)
```

### 3. Deploy the stack

```bash
# Run this in the root project directory
cdk deploy
```

---

## ✨ Example: Logging Wrapper

```ts
export const withLogging = (handler) => async (event, context) => {
  logger.info("Lambda Invoked", { ... });
  try {
    const result = await handler(event, context);
    logger.info("Lambda Succeeded", { statusCode: result.statusCode });
    return result;
  } catch (error) {
    logger.error("Lambda Failed", { error });
    throw error;
  }
};
```

Use it in your handler like:

```ts
export const handler = withLogging(async (event) => { ... });
```

---

## 🧪 Endpoints

| Method | Path    | Lambda     | Description              |
| ------ | ------- | ---------- | ------------------------ |
| GET    | `/blog` | getBlogs   | Returns a list of blogs  |
| POST   | `/blog` | createBlog | Creates a new blog entry |

---

## 📖 Logs in CloudWatch

Structured logs include context:

```json
{
  "level": "info",
  "msg": "Lambda Invoked",
  "requestId": "abc-123",
  "functionName": "CreateBlogFunction",
  "path": "/blog",
  "httpMethod": "POST"
}
```

---

## 🧠 Why Use a Lambda Layer for Logging?

- Centralized, DRY logging logic
- Consistent structure across all functions
- Easier debugging and log querying
- Cleaner business logic in handlers
