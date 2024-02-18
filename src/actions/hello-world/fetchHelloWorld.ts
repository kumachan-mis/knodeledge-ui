'use server';

import { Errorable, config, fetchFromOpenApi } from '@/actions/openapi';
import { HelloWorldRequest, HelloWorldResponse } from '@/openapi';
import { HelloWorldApi } from '@/openapi/apis';

const helloWorldApi = new HelloWorldApi(config);

export async function fetchHelloWorld(request: HelloWorldRequest): Promise<Errorable<HelloWorldResponse>> {
  return await fetchFromOpenApi(() => helloWorldApi.get({ helloWorldRequest: request }));
}
