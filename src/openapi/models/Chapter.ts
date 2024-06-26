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
/**
 * Chapter object
 * @export
 * @interface Chapter
 */
export interface Chapter {
  /**
   * Auto-generated chapter ID
   * @type {string}
   * @memberof Chapter
   */
  id: string;
  /**
   * Chapter name
   * @type {string}
   * @memberof Chapter
   */
  name: string;
  /**
   * Chapter number
   * @type {number}
   * @memberof Chapter
   */
  number: number;
}

/**
 * Check if a given object implements the Chapter interface.
 */
export function instanceOfChapter(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'id' in value;
  isInstance = isInstance && 'name' in value;
  isInstance = isInstance && 'number' in value;

  return isInstance;
}

export function ChapterFromJSON(json: any): Chapter {
  return ChapterFromJSONTyped(json, false);
}

export function ChapterFromJSONTyped(json: any, ignoreDiscriminator: boolean): Chapter {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    name: json['name'],
    number: json['number'],
  };
}

export function ChapterToJSON(value?: Chapter | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    name: value.name,
    number: value.number,
  };
}
