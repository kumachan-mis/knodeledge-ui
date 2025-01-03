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
import type { ChapterWithoutAutofield } from './ChapterWithoutAutofield';
import {
  ChapterWithoutAutofieldFromJSON,
  ChapterWithoutAutofieldFromJSONTyped,
  ChapterWithoutAutofieldToJSON,
  ChapterWithoutAutofieldToJSONTyped,
} from './ChapterWithoutAutofield';
import type { UserOnlyId } from './UserOnlyId';
import { UserOnlyIdFromJSON, UserOnlyIdFromJSONTyped, UserOnlyIdToJSON, UserOnlyIdToJSONTyped } from './UserOnlyId';

/**
 * Request Body for Chapter Create API
 * @export
 * @interface ChapterCreateRequest
 */
export interface ChapterCreateRequest {
  /**
   *
   * @type {UserOnlyId}
   * @memberof ChapterCreateRequest
   */
  user: UserOnlyId;
  /**
   *
   * @type {ProjectOnlyId}
   * @memberof ChapterCreateRequest
   */
  project: ProjectOnlyId;
  /**
   *
   * @type {ChapterWithoutAutofield}
   * @memberof ChapterCreateRequest
   */
  chapter: ChapterWithoutAutofield;
}

/**
 * Check if a given object implements the ChapterCreateRequest interface.
 */
export function instanceOfChapterCreateRequest(value: object): value is ChapterCreateRequest {
  if (!('user' in value) || value['user'] === undefined) return false;
  if (!('project' in value) || value['project'] === undefined) return false;
  if (!('chapter' in value) || value['chapter'] === undefined) return false;
  return true;
}

export function ChapterCreateRequestFromJSON(json: any): ChapterCreateRequest {
  return ChapterCreateRequestFromJSONTyped(json, false);
}

export function ChapterCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChapterCreateRequest {
  if (json == null) {
    return json;
  }
  return {
    user: UserOnlyIdFromJSON(json['user']),
    project: ProjectOnlyIdFromJSON(json['project']),
    chapter: ChapterWithoutAutofieldFromJSON(json['chapter']),
  };
}

export function ChapterCreateRequestToJSON(json: any): ChapterCreateRequest {
  return ChapterCreateRequestToJSONTyped(json, false);
}

export function ChapterCreateRequestToJSONTyped(
  value?: ChapterCreateRequest | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    user: UserOnlyIdToJSON(value['user']),
    project: ProjectOnlyIdToJSON(value['project']),
    chapter: ChapterWithoutAutofieldToJSON(value['chapter']),
  };
}
