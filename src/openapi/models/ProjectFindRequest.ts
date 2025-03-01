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
import type { ProjectOnlyId } from './ProjectOnlyId';
import {
  ProjectOnlyIdFromJSON,
  ProjectOnlyIdFromJSONTyped,
  ProjectOnlyIdToJSON,
  ProjectOnlyIdToJSONTyped,
} from './ProjectOnlyId';
import type { UserOnlyId } from './UserOnlyId';
import { UserOnlyIdFromJSON, UserOnlyIdFromJSONTyped, UserOnlyIdToJSON, UserOnlyIdToJSONTyped } from './UserOnlyId';

/**
 * Request Body for Project Find API
 * @export
 * @interface ProjectFindRequest
 */
export interface ProjectFindRequest {
  /**
   *
   * @type {UserOnlyId}
   * @memberof ProjectFindRequest
   */
  user: UserOnlyId;
  /**
   *
   * @type {ProjectOnlyId}
   * @memberof ProjectFindRequest
   */
  project: ProjectOnlyId;
}

/**
 * Check if a given object implements the ProjectFindRequest interface.
 */
export function instanceOfProjectFindRequest(value: object): value is ProjectFindRequest {
  if (!('user' in value) || value['user'] === undefined) return false;
  if (!('project' in value) || value['project'] === undefined) return false;
  return true;
}

export function ProjectFindRequestFromJSON(json: any): ProjectFindRequest {
  return ProjectFindRequestFromJSONTyped(json, false);
}

export function ProjectFindRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectFindRequest {
  if (json == null) {
    return json;
  }
  return {
    user: UserOnlyIdFromJSON(json['user']),
    project: ProjectOnlyIdFromJSON(json['project']),
  };
}

export function ProjectFindRequestToJSON(json: any): ProjectFindRequest {
  return ProjectFindRequestToJSONTyped(json, false);
}

export function ProjectFindRequestToJSONTyped(
  value?: ProjectFindRequest | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    user: UserOnlyIdToJSON(value['user']),
    project: ProjectOnlyIdToJSON(value['project']),
  };
}
