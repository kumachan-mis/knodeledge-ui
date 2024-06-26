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
 * Paper object
 * @export
 * @interface Paper
 */
export interface Paper {
  /**
   * Auto-generated paper ID
   * @type {string}
   * @memberof Paper
   */
  id: string;
  /**
   * Paper content
   * @type {string}
   * @memberof Paper
   */
  content: string;
}

/**
 * Check if a given object implements the Paper interface.
 */
export function instanceOfPaper(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'id' in value;
  isInstance = isInstance && 'content' in value;

  return isInstance;
}

export function PaperFromJSON(json: any): Paper {
  return PaperFromJSONTyped(json, false);
}

export function PaperFromJSONTyped(json: any, ignoreDiscriminator: boolean): Paper {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    content: json['content'],
  };
}

export function PaperToJSON(value?: Paper | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    content: value.content,
  };
}
