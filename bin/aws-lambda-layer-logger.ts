#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsLambdaLayerLoggerStack } from "../stacks/aws-lambda-layer-logger-stack";

const app = new cdk.App();
new AwsLambdaLayerLoggerStack(app, "AwsLambdaLayerLoggerStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
