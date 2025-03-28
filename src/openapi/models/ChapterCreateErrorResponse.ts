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
import type { ChapterWithoutAutofieldError } from './ChapterWithoutAutofieldError';
import {
  ChapterWithoutAutofieldErrorFromJSON,
  ChapterWithoutAutofieldErrorFromJSONTyped,
  ChapterWithoutAutofieldErrorToJSON,
  ChapterWithoutAutofieldErrorToJSONTyped,
} from './ChapterWithoutAutofieldError';

/**
 * Error Response Body for Chapter Create API
 * @export
 * @interface ChapterCreateErrorResponse
 */
export interface ChapterCreateErrorResponse {
  /**
   * Error message when request body format is invalid
   * @type {string}
   * @memberof ChapterCreateErrorResponse
   */
  message: string;
  /**
   *
   * @type {UserOnlyIdError}
   * @memberof ChapterCreateErrorResponse
   */
  user?: UserOnlyIdError;
  /**
   *
   * @type {ProjectOnlyIdError}
   * @memberof ChapterCreateErrorResponse
   */
  project?: ProjectOnlyIdError;
  /**
   *
   * @type {ChapterWithoutAutofieldError}
   * @memberof ChapterCreateErrorResponse
   */
  chapter?: ChapterWithoutAutofieldError;
}

/**
 * Check if a given object implements the ChapterCreateErrorResponse interface.
 */
export function instanceOfChapterCreateErrorResponse(value: object): value is ChapterCreateErrorResponse {
  if (!('message' in value) || value['message'] === undefined) return false;
  return true;
}

export function ChapterCreateErrorResponseFromJSON(json: any): ChapterCreateErrorResponse {
  return ChapterCreateErrorResponseFromJSONTyped(json, false);
}

export function ChapterCreateErrorResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ChapterCreateErrorResponse {
  if (json == null) {
    return json;
  }
  return {
    message: json['message'],
    user: json['user'] == null ? undefined : UserOnlyIdErrorFromJSON(json['user']),
    project: json['project'] == null ? undefined : ProjectOnlyIdErrorFromJSON(json['project']),
    chapter: json['chapter'] == null ? undefined : ChapterWithoutAutofieldErrorFromJSON(json['chapter']),
  };
}

export function ChapterCreateErrorResponseToJSON(json: any): ChapterCreateErrorResponse {
  return ChapterCreateErrorResponseToJSONTyped(json, false);
}

export function ChapterCreateErrorResponseToJSONTyped(
  value?: ChapterCreateErrorResponse | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    message: value['message'],
    user: UserOnlyIdErrorToJSON(value['user']),
    project: ProjectOnlyIdErrorToJSON(value['project']),
    chapter: ChapterWithoutAutofieldErrorToJSON(value['chapter']),
  };
}
