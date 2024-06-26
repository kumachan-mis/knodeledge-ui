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

import { exists, mapValues } from '../runtime';
import type { UserOnlyIdError } from './UserOnlyIdError';
import { UserOnlyIdErrorFromJSON, UserOnlyIdErrorFromJSONTyped, UserOnlyIdErrorToJSON } from './UserOnlyIdError';

/**
 * Error Response Body for Project List API
 * @export
 * @interface ProjectListErrorResponse
 */
export interface ProjectListErrorResponse {
  /**
   * Error message when request body format is invalid
   * @type {string}
   * @memberof ProjectListErrorResponse
   */
  message?: string;
  /**
   *
   * @type {UserOnlyIdError}
   * @memberof ProjectListErrorResponse
   */
  user?: UserOnlyIdError;
}

/**
 * Check if a given object implements the ProjectListErrorResponse interface.
 */
export function instanceOfProjectListErrorResponse(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function ProjectListErrorResponseFromJSON(json: any): ProjectListErrorResponse {
  return ProjectListErrorResponseFromJSONTyped(json, false);
}

export function ProjectListErrorResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ProjectListErrorResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    message: !exists(json, 'message') ? undefined : json['message'],
    user: !exists(json, 'user') ? undefined : UserOnlyIdErrorFromJSON(json['user']),
  };
}

export function ProjectListErrorResponseToJSON(value?: ProjectListErrorResponse | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    message: value.message,
    user: UserOnlyIdErrorToJSON(value.user),
  };
}
