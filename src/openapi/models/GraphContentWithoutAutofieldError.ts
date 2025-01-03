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
import type { GraphChildrenError } from './GraphChildrenError';
import {
  GraphChildrenErrorFromJSON,
  GraphChildrenErrorFromJSONTyped,
  GraphChildrenErrorToJSON,
  GraphChildrenErrorToJSONTyped,
} from './GraphChildrenError';

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
  /**
   *
   * @type {GraphChildrenError}
   * @memberof GraphContentWithoutAutofieldError
   */
  children?: GraphChildrenError;
}

/**
 * Check if a given object implements the GraphContentWithoutAutofieldError interface.
 */
export function instanceOfGraphContentWithoutAutofieldError(value: object): value is GraphContentWithoutAutofieldError {
  return true;
}

export function GraphContentWithoutAutofieldErrorFromJSON(json: any): GraphContentWithoutAutofieldError {
  return GraphContentWithoutAutofieldErrorFromJSONTyped(json, false);
}

export function GraphContentWithoutAutofieldErrorFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GraphContentWithoutAutofieldError {
  if (json == null) {
    return json;
  }
  return {
    paragraph: json['paragraph'] == null ? undefined : json['paragraph'],
    children: json['children'] == null ? undefined : GraphChildrenErrorFromJSON(json['children']),
  };
}

export function GraphContentWithoutAutofieldErrorToJSON(json: any): GraphContentWithoutAutofieldError {
  return GraphContentWithoutAutofieldErrorToJSONTyped(json, false);
}

export function GraphContentWithoutAutofieldErrorToJSONTyped(
  value?: GraphContentWithoutAutofieldError | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    paragraph: value['paragraph'],
    children: GraphChildrenErrorToJSON(value['children']),
  };
}
