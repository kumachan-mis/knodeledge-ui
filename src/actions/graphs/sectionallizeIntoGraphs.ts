import { Errorable, fetchFromOpenApi, defaultOnResposeError } from '../openapi';
import {
  GraphSectionalizeRequest,
  GraphSectionalizeResponse,
  GraphSectionalizeErrorResponse,
  GraphSectionalizeErrorResponseFromJSON,
} from '@/openapi';

import { graphsApi } from './api';

export async function sectionalizeIntoGraphs(
  request: GraphSectionalizeRequest,
): Promise<Errorable<GraphSectionalizeResponse, GraphSectionalizeErrorResponse>> {
  return await fetchFromOpenApi(
    async () => await graphsApi.graphsSectionalize({ graphSectionalizeRequest: request }),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = GraphSectionalizeErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
