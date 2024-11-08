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
import type { ChapterWithoutAutofield } from './ChapterWithoutAutofield';
import {
  ChapterWithoutAutofieldFromJSON,
  ChapterWithoutAutofieldFromJSONTyped,
  ChapterWithoutAutofieldToJSON,
} from './ChapterWithoutAutofield';
import type { ProjectOnlyId } from './ProjectOnlyId';
import { ProjectOnlyIdFromJSON, ProjectOnlyIdFromJSONTyped, ProjectOnlyIdToJSON } from './ProjectOnlyId';
import type { UserOnlyId } from './UserOnlyId';
import { UserOnlyIdFromJSON, UserOnlyIdFromJSONTyped, UserOnlyIdToJSON } from './UserOnlyId';

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
export function instanceOfChapterCreateRequest(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'user' in value;
  isInstance = isInstance && 'project' in value;
  isInstance = isInstance && 'chapter' in value;

  return isInstance;
}

export function ChapterCreateRequestFromJSON(json: any): ChapterCreateRequest {
  return ChapterCreateRequestFromJSONTyped(json, false);
}

export function ChapterCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChapterCreateRequest {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    user: UserOnlyIdFromJSON(json['user']),
    project: ProjectOnlyIdFromJSON(json['project']),
    chapter: ChapterWithoutAutofieldFromJSON(json['chapter']),
  };
}

export function ChapterCreateRequestToJSON(value?: ChapterCreateRequest | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    user: UserOnlyIdToJSON(value.user),
    project: ProjectOnlyIdToJSON(value.project),
    chapter: ChapterWithoutAutofieldToJSON(value.chapter),
  };
}
