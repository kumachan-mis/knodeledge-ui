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
import type { ChapterOnlyId } from './ChapterOnlyId';
import {
  ChapterOnlyIdFromJSON,
  ChapterOnlyIdFromJSONTyped,
  ChapterOnlyIdToJSON,
  ChapterOnlyIdToJSONTyped,
} from './ChapterOnlyId';
import type { UserOnlyId } from './UserOnlyId';
import { UserOnlyIdFromJSON, UserOnlyIdFromJSONTyped, UserOnlyIdToJSON, UserOnlyIdToJSONTyped } from './UserOnlyId';

/**
 * Request Body for Chapter Delete API
 * @export
 * @interface ChapterDeleteRequest
 */
export interface ChapterDeleteRequest {
  /**
   *
   * @type {UserOnlyId}
   * @memberof ChapterDeleteRequest
   */
  user: UserOnlyId;
  /**
   *
   * @type {ProjectOnlyId}
   * @memberof ChapterDeleteRequest
   */
  project: ProjectOnlyId;
  /**
   *
   * @type {ChapterOnlyId}
   * @memberof ChapterDeleteRequest
   */
  chapter: ChapterOnlyId;
}

/**
 * Check if a given object implements the ChapterDeleteRequest interface.
 */
export function instanceOfChapterDeleteRequest(value: object): value is ChapterDeleteRequest {
  if (!('user' in value) || value['user'] === undefined) return false;
  if (!('project' in value) || value['project'] === undefined) return false;
  if (!('chapter' in value) || value['chapter'] === undefined) return false;
  return true;
}

export function ChapterDeleteRequestFromJSON(json: any): ChapterDeleteRequest {
  return ChapterDeleteRequestFromJSONTyped(json, false);
}

export function ChapterDeleteRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChapterDeleteRequest {
  if (json == null) {
    return json;
  }
  return {
    user: UserOnlyIdFromJSON(json['user']),
    project: ProjectOnlyIdFromJSON(json['project']),
    chapter: ChapterOnlyIdFromJSON(json['chapter']),
  };
}

export function ChapterDeleteRequestToJSON(json: any): ChapterDeleteRequest {
  return ChapterDeleteRequestToJSONTyped(json, false);
}

export function ChapterDeleteRequestToJSONTyped(
  value?: ChapterDeleteRequest | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    user: UserOnlyIdToJSON(value['user']),
    project: ProjectOnlyIdToJSON(value['project']),
    chapter: ChapterOnlyIdToJSON(value['chapter']),
  };
}
