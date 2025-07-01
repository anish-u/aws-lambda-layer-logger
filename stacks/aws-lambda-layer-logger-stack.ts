import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import path from "path";

export class AwsLambdaLayerLoggerStack extends cdk.Stack {
  private readonly PROJECT_TAG_KEY = "project";
  private readonly PROJECT_TAG_VALUE = "aws-lambda-layer-logger";

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add(this.PROJECT_TAG_KEY, this.PROJECT_TAG_VALUE);

    const loggingLayer = new lambda.LayerVersion(this, "LoggingLayer", {
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../src/layers/logger/dist")
      ),
      layerVersionName: "LoggingLayer",
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: "Shared logging utility",
    });

    const getBlogsFunction = new NodejsFunction(this, "GetBlogsFunction", {
      entry: path.join(__dirname, "../src/lambdas/getBlogs.ts"),
      handler: "handler",
      functionName: "GetBlogsFunction",
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [loggingLayer],
      logRetention: RetentionDays.ONE_WEEK,
    });

    const createBlogFunction = new NodejsFunction(this, "CreateBlogFunction", {
      entry: path.join(__dirname, "../src/lambdas/createBlog.ts"),
      handler: "handler",
      functionName: "CreateBlogFunction",
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [loggingLayer],
      logRetention: RetentionDays.ONE_WEEK,
    });

    const api = new apigateway.RestApi(this, "BlogsApi", {
      restApiName: "Blog Service",
      description: "This is a blog service",
      deployOptions: {
        stageName: "dev",
      },
    });

    const blogRoute = api.root.addResource("blog");
    blogRoute.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getBlogsFunction)
    );
    blogRoute.addMethod(
      "POST",
      new apigateway.LambdaIntegration(createBlogFunction)
    );

    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.url ?? "No API URL",
    });
  }
}
