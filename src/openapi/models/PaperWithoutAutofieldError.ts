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
 * Error Message for PaperWithoutAutofield object
 * @export
 * @interface PaperWithoutAutofieldError
 */
export interface PaperWithoutAutofieldError {
  /**
   * Error message for paper content
   * @type {string}
   * @memberof PaperWithoutAutofieldError
   */
  content?: string;
}

/**
 * Check if a given object implements the PaperWithoutAutofieldError interface.
 */
export function instanceOfPaperWithoutAutofieldError(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function PaperWithoutAutofieldErrorFromJSON(json: any): PaperWithoutAutofieldError {
  return PaperWithoutAutofieldErrorFromJSONTyped(json, false);
}

export function PaperWithoutAutofieldErrorFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): PaperWithoutAutofieldError {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    content: !exists(json, 'content') ? undefined : json['content'],
  };
}

export function PaperWithoutAutofieldErrorToJSON(value?: PaperWithoutAutofieldError | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    content: value.content,
  };
}