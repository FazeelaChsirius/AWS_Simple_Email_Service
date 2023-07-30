import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as actions from "@aws-cdk/aws-ses-actions";
import * as ses from "@aws-cdk/aws-ses";
//import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import { Effect } from 'aws-cdk-lib/aws-iam';


export class AwsSesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucket = new s3.Bucket(this, 'Bucket',{
      bucketName: "emailsave",
      versioned: true,
    });

    const lambdaFn = new lambda.Function(this, 'lambda', {
      functionName: "fazeela_lambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
      memorySize: 1024,
    });

    const ruleSet = new ses.ReceiptRuleSet(this, "Rule_SES",{
      receiptRuleSetName: "Rule_ses_service",
    });
    
    ruleSet.addRule("Invoke_lambda",{
      recipients: ["fazeelamushtaq076@gmail.com","about@fazeela.ml"],
      actions:[
        new actions.Lambda({
          function: lambdaFn,
          invocationType: actions.LambdaInvocationType.EVENT,
        }),
        new actions.S3({
          bucket,
          objectKeyPrefix: "emails/"
        }),
      ],
      scanEnabled: true,
    });
 
    

  }
}
