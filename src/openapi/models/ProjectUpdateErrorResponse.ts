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
import type { ProjectError } from './ProjectError';
import { ProjectErrorFromJSON, ProjectErrorFromJSONTyped, ProjectErrorToJSON } from './ProjectError';
import type { UserOnlyIdError } from './UserOnlyIdError';
import { UserOnlyIdErrorFromJSON, UserOnlyIdErrorFromJSONTyped, UserOnlyIdErrorToJSON } from './UserOnlyIdError';

/**
 * Error Response Body for Project Update API
 * @export
 * @interface ProjectUpdateErrorResponse
 */
export interface ProjectUpdateErrorResponse {
  /**
   * Error message when request body format is invalid
   * @type {string}
   * @memberof ProjectUpdateErrorResponse
   */
  message?: string;
  /**
   *
   * @type {UserOnlyIdError}
   * @memberof ProjectUpdateErrorResponse
   */
  user?: UserOnlyIdError;
  /**
   *
   * @type {ProjectError}
   * @memberof ProjectUpdateErrorResponse
   */
  project?: ProjectError;
}

/**
 * Check if a given object implements the ProjectUpdateErrorResponse interface.
 */
export function instanceOfProjectUpdateErrorResponse(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function ProjectUpdateErrorResponseFromJSON(json: any): ProjectUpdateErrorResponse {
  return ProjectUpdateErrorResponseFromJSONTyped(json, false);
}

export function ProjectUpdateErrorResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ProjectUpdateErrorResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    message: !exists(json, 'message') ? undefined : json['message'],
    user: !exists(json, 'user') ? undefined : UserOnlyIdErrorFromJSON(json['user']),
    project: !exists(json, 'project') ? undefined : ProjectErrorFromJSON(json['project']),
  };
}

export function ProjectUpdateErrorResponseToJSON(value?: ProjectUpdateErrorResponse | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    message: value.message,
    user: UserOnlyIdErrorToJSON(value.user),
    project: ProjectErrorToJSON(value.project),
  };
}