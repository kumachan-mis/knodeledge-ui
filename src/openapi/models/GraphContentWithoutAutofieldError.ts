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
 * Error Message for GraphContentWithoutAutofield object
 * @export
 * @interface GraphContentWithoutAutofieldError
 */
export interface GraphContentWithoutAutofieldError {
  /**
   * Error message for graph paragraph
   * @type {string}
   * @memberof GraphContentWithoutAutofieldError
   */
  paragraph?: string;
}

/**
 * Check if a given object implements the GraphContentWithoutAutofieldError interface.
 */
export function instanceOfGraphContentWithoutAutofieldError(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function GraphContentWithoutAutofieldErrorFromJSON(json: any): GraphContentWithoutAutofieldError {
  return GraphContentWithoutAutofieldErrorFromJSONTyped(json, false);
}

export function GraphContentWithoutAutofieldErrorFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GraphContentWithoutAutofieldError {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    paragraph: !exists(json, 'paragraph') ? undefined : json['paragraph'],
  };
}

export function GraphContentWithoutAutofieldErrorToJSON(value?: GraphContentWithoutAutofieldError | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    paragraph: value.paragraph,
  };
}