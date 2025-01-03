/* eslint-disable */
/**
 * Web API of kNODEledge
 * App to Create Graphically-Summarized Notes in Three Steps
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime';
import type {
  ApplicationErrorResponse,
  PaperFindErrorResponse,
  PaperFindRequest,
  PaperFindResponse,
  PaperUpdateErrorResponse,
  PaperUpdateRequest,
  PaperUpdateResponse,
} from '../models/index';
import {
  ApplicationErrorResponseFromJSON,
  ApplicationErrorResponseToJSON,
  PaperFindErrorResponseFromJSON,
  PaperFindErrorResponseToJSON,
  PaperFindRequestFromJSON,
  PaperFindRequestToJSON,
  PaperFindResponseFromJSON,
  PaperFindResponseToJSON,
  PaperUpdateErrorResponseFromJSON,
  PaperUpdateErrorResponseToJSON,
  PaperUpdateRequestFromJSON,
  PaperUpdateRequestToJSON,
  PaperUpdateResponseFromJSON,
  PaperUpdateResponseToJSON,
} from '../models/index';

export interface PapersFindRequest {
  paperFindRequest?: PaperFindRequest;
}

export interface PapersUpdateRequest {
  paperUpdateRequest?: PaperUpdateRequest;
}

/**
 *
 */
export class PapersApi extends runtime.BaseAPI {
  /**
   * Find paper
   */
  async papersFindRaw(
    requestParameters: PapersFindRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<PaperFindResponse>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request(
      {
        path: `/api/papers/find`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: PaperFindRequestToJSON(requestParameters['paperFindRequest']),
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => PaperFindResponseFromJSON(jsonValue));
  }

  /**
   * Find paper
   */
  async papersFind(
    requestParameters: PapersFindRequest = {},
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<PaperFindResponse> {
    const response = await this.papersFindRaw(requestParameters, initOverrides);
    return await response.value();
  }

  /**
   * Update paper
   */
  async papersUpdateRaw(
    requestParameters: PapersUpdateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<PaperUpdateResponse>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request(
      {
        path: `/api/papers/update`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: PaperUpdateRequestToJSON(requestParameters['paperUpdateRequest']),
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => PaperUpdateResponseFromJSON(jsonValue));
  }

  /**
   * Update paper
   */
  async papersUpdate(
    requestParameters: PapersUpdateRequest = {},
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<PaperUpdateResponse> {
    const response = await this.papersUpdateRaw(requestParameters, initOverrides);
    return await response.value();
  }
}
