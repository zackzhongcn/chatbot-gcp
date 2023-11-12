import { NextRequest, NextResponse } from 'next/server';
// Import the helper module for converting arbitrary protobuf.Value objects.
import aiplatform, { helpers, protos } from '@google-cloud/aiplatform';
import { google } from '@google-cloud/aiplatform/build/protos/protos';

/**
 * TODO(developer): Uncomment these variables before running the sample.\
 * (Not necessary if passing values as arguments)
 */
const project = 'noted-runway-404705';
const location = 'us-central1';

// Imports the Google Cloud Prediction service client
const { PredictionServiceClient } = aiplatform.v1;

// POST /api/students
// Required fields in body: question
export async function POST(request: Request) {
  try {
    const json = await request.json();
    console.log('json: ', json);
    const { question } = json;

    const credential = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_KEY as string, 'base64').toString()
    );
    const clientOptions = {
      apiEndpoint: 'us-central1-aiplatform.googleapis.com',
      credentials: {
        client_email: credential.client_email,
        private_key: credential.private_key,
      },
    };
    const publisher = 'google';
    const model = 'text-bison@001';

    const predictionServiceClient = new PredictionServiceClient(clientOptions);
    // Configure the parent resource
    const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

    const instance: object = {
      content: question,
    };
    const instanceValue = helpers.toValue(instance) as google.protobuf.IValue;
    const instances: google.protobuf.IValue[] = [instanceValue];
    const parameter = {
      temperature: 0,
      maxOutputTokens: 1024,
      topP: 0,
      topK: 1,
    };
    const parameters = helpers.toValue(parameter);
    const googleRequest: protos.google.cloud.aiplatform.v1.IPredictRequest = {
      endpoint,
      instances,
      parameters,
    };

    // Predict request
    const [response] = await predictionServiceClient.predict(googleRequest);
    console.log('Get text embeddings response');
    const predictions = response.predictions;
    for (const prediction of predictions as google.protobuf.IValue[]) {
      console.log(`Prediction :\n${JSON.stringify(prediction)}`);
    }
    let result = predictions?.at(-1)?.structValue?.fields as any;
    result = result.content.stringValue;
    return new NextResponse(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('error: ', error);
    const error_response = {
      status: 'error',
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
