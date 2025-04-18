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
 * Error Response Body for Project Delete API
 * @export
 * @interface ProjectDeleteErrorResponse
 */
export interface ProjectDeleteErrorResponse {
  /**
   * Error message when request body format is invalid
   * @type {string}
   * @memberof ProjectDeleteErrorResponse
   */
  message: string;
  /**
   *
   * @type {UserOnlyIdError}
   * @memberof ProjectDeleteErrorResponse
   */
  user?: UserOnlyIdError;
  /**
   *
   * @type {ProjectOnlyIdError}
   * @memberof ProjectDeleteErrorResponse
   */
  project?: ProjectOnlyIdError;
}

/**
 * Check if a given object implements the ProjectDeleteErrorResponse interface.
 */
export function instanceOfProjectDeleteErrorResponse(value: object): value is ProjectDeleteErrorResponse {
  if (!('message' in value) || value['message'] === undefined) return false;
  return true;
}

export function ProjectDeleteErrorResponseFromJSON(json: any): ProjectDeleteErrorResponse {
  return ProjectDeleteErrorResponseFromJSONTyped(json, false);
}

export function ProjectDeleteErrorResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ProjectDeleteErrorResponse {
  if (json == null) {
    return json;
  }
  return {
    message: json['message'],
    user: json['user'] == null ? undefined : UserOnlyIdErrorFromJSON(json['user']),
    project: json['project'] == null ? undefined : ProjectOnlyIdErrorFromJSON(json['project']),
  };
}

export function ProjectDeleteErrorResponseToJSON(json: any): ProjectDeleteErrorResponse {
  return ProjectDeleteErrorResponseToJSONTyped(json, false);
}

export function ProjectDeleteErrorResponseToJSONTyped(
  value?: ProjectDeleteErrorResponse | null,
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
