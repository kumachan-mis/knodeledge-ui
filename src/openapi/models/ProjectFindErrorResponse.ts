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

import { mapValues } from '../runtime';
import type { ProjectOnlyIdError } from './ProjectOnlyIdError';
import {
  ProjectOnlyIdErrorFromJSON,
  ProjectOnlyIdErrorFromJSONTyped,
  ProjectOnlyIdErrorToJSON,
  ProjectOnlyIdErrorToJSONTyped,
} from './ProjectOnlyIdError';
import type { UserOnlyIdError } from './UserOnlyIdError';
import {
  UserOnlyIdErrorFromJSON,
  UserOnlyIdErrorFromJSONTyped,
  UserOnlyIdErrorToJSON,
  UserOnlyIdErrorToJSONTyped,
} from './UserOnlyIdError';

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
  message: string;
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
export function instanceOfProjectFindErrorResponse(value: object): value is ProjectFindErrorResponse {
  if (!('message' in value) || value['message'] === undefined) return false;
  return true;
}

export function ProjectFindErrorResponseFromJSON(json: any): ProjectFindErrorResponse {
  return ProjectFindErrorResponseFromJSONTyped(json, false);
}

export function ProjectFindErrorResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ProjectFindErrorResponse {
  if (json == null) {
    return json;
  }
  return {
    message: json['message'],
    user: json['user'] == null ? undefined : UserOnlyIdErrorFromJSON(json['user']),
    project: json['project'] == null ? undefined : ProjectOnlyIdErrorFromJSON(json['project']),
  };
}

export function ProjectFindErrorResponseToJSON(json: any): ProjectFindErrorResponse {
  return ProjectFindErrorResponseToJSONTyped(json, false);
}

export function ProjectFindErrorResponseToJSONTyped(
  value?: ProjectFindErrorResponse | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    message: value['message'],
    user: UserOnlyIdErrorToJSON(value['user']),
    project: ProjectOnlyIdErrorToJSON(value['project']),
  };
}
