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
import type { ProjectOnlyId } from './ProjectOnlyId';
import { ProjectOnlyIdFromJSON, ProjectOnlyIdFromJSONTyped, ProjectOnlyIdToJSON } from './ProjectOnlyId';
import type { UserOnlyId } from './UserOnlyId';
import { UserOnlyIdFromJSON, UserOnlyIdFromJSONTyped, UserOnlyIdToJSON } from './UserOnlyId';

/**
 * Request Body for Chapter List API
 * @export
 * @interface ChapterListRequest
 */
export interface ChapterListRequest {
  /**
   *
   * @type {UserOnlyId}
   * @memberof ChapterListRequest
   */
  user: UserOnlyId;
  /**
   *
   * @type {ProjectOnlyId}
   * @memberof ChapterListRequest
   */
  project: ProjectOnlyId;
}

/**
 * Check if a given object implements the ChapterListRequest interface.
 */
export function instanceOfChapterListRequest(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'user' in value;
  isInstance = isInstance && 'project' in value;

  return isInstance;
}

export function ChapterListRequestFromJSON(json: any): ChapterListRequest {
  return ChapterListRequestFromJSONTyped(json, false);
}

export function ChapterListRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChapterListRequest {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    user: UserOnlyIdFromJSON(json['user']),
    project: ProjectOnlyIdFromJSON(json['project']),
  };
}

export function ChapterListRequestToJSON(value?: ChapterListRequest | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    user: UserOnlyIdToJSON(value.user),
    project: ProjectOnlyIdToJSON(value.project),
  };
}
