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
import type { ChapterWithSections } from './ChapterWithSections';
import {
  ChapterWithSectionsFromJSON,
  ChapterWithSectionsFromJSONTyped,
  ChapterWithSectionsToJSON,
} from './ChapterWithSections';

/**
 * Response Body for Chapter Create API
 * @export
 * @interface ChapterCreateResponse
 */
export interface ChapterCreateResponse {
  /**
   *
   * @type {ChapterWithSections}
   * @memberof ChapterCreateResponse
   */
  chapter: ChapterWithSections;
}

/**
 * Check if a given object implements the ChapterCreateResponse interface.
 */
export function instanceOfChapterCreateResponse(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'chapter' in value;

  return isInstance;
}

export function ChapterCreateResponseFromJSON(json: any): ChapterCreateResponse {
  return ChapterCreateResponseFromJSONTyped(json, false);
}

export function ChapterCreateResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChapterCreateResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    chapter: ChapterWithSectionsFromJSON(json['chapter']),
  };
}

export function ChapterCreateResponseToJSON(value?: ChapterCreateResponse | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    chapter: ChapterWithSectionsToJSON(value.chapter),
  };
}
