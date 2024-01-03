'use server';

import { HelloWorldRequest, HelloWorldResponse } from '@/openapi';
import { HelloWorldApi } from '@/openapi/apis';
import { Errorable, config, fetchFromOpenApi } from '@/utils/openapi';

const helloWorldApi = new HelloWorldApi(config);

export async function fetchHelloWorld(request: HelloWorldRequest): Promise<Errorable<HelloWorldResponse>> {
  return await fetchFromOpenApi(() => helloWorldApi.get({ helloWorldRequest: request }));
}
