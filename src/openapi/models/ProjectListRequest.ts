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
import type { User } from './User';
import { UserFromJSON, UserFromJSONTyped, UserToJSON } from './User';

/**
 * Request Body for Project List API
 * @export
 * @interface ProjectListRequest
 */
export interface ProjectListRequest {
  /**
   *
   * @type {User}
   * @memberof ProjectListRequest
   */
  user: User;
}

/**
 * Check if a given object implements the ProjectListRequest interface.
 */
export function instanceOfProjectListRequest(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'user' in value;

  return isInstance;
}

export function ProjectListRequestFromJSON(json: any): ProjectListRequest {
  return ProjectListRequestFromJSONTyped(json, false);
}

export function ProjectListRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectListRequest {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    user: UserFromJSON(json['user']),
  };
}

export function ProjectListRequestToJSON(value?: ProjectListRequest | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    user: UserToJSON(value.user),
  };
}