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
import type { ProjectOnlyIdError } from './ProjectOnlyIdError';
import {
  ProjectOnlyIdErrorFromJSON,
  ProjectOnlyIdErrorFromJSONTyped,
  ProjectOnlyIdErrorToJSON,
} from './ProjectOnlyIdError';
import type { UserOnlyIdError } from './UserOnlyIdError';
import { UserOnlyIdErrorFromJSON, UserOnlyIdErrorFromJSONTyped, UserOnlyIdErrorToJSON } from './UserOnlyIdError';

/**
 * Error Response Body for Project Find API
 * @export
 * @interface ProjectFindErrorResponse
 */
export interface ProjectFindErrorResponse {
  /**
   * Error message when request body format is invalid
   * @type {string}
   * @memberof ProjectFindErrorResponse
   */
  message?: string;
  /**
   *
   * @type {UserOnlyIdError}
   * @memberof ProjectFindErrorResponse
   */
  user?: UserOnlyIdError;
  /**
   *
   * @type {ProjectOnlyIdError}
   * @memberof ProjectFindErrorResponse
   */
  project?: ProjectOnlyIdError;
}

/**
 * Check if a given object implements the ProjectFindErrorResponse interface.
 */
export function instanceOfProjectFindErrorResponse(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function ProjectFindErrorResponseFromJSON(json: any): ProjectFindErrorResponse {
  return ProjectFindErrorResponseFromJSONTyped(json, false);
}

export function ProjectFindErrorResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ProjectFindErrorResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    message: !exists(json, 'message') ? undefined : json['message'],
    user: !exists(json, 'user') ? undefined : UserOnlyIdErrorFromJSON(json['user']),
    project: !exists(json, 'project') ? undefined : ProjectOnlyIdErrorFromJSON(json['project']),
  };
}

export function ProjectFindErrorResponseToJSON(value?: ProjectFindErrorResponse | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    message: value.message,
    user: UserOnlyIdErrorToJSON(value.user),
    project: ProjectOnlyIdErrorToJSON(value.project),
  };
}