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
import type { GraphContent } from './GraphContent';
import { GraphContentFromJSON, GraphContentFromJSONTyped, GraphContentToJSON } from './GraphContent';

/**
 * Response Body for Graph Update API
 * @export
 * @interface GraphUpdateResponse
 */
export interface GraphUpdateResponse {
  /**
   *
   * @type {GraphContent}
   * @memberof GraphUpdateResponse
   */
  graph: GraphContent;
}

/**
 * Check if a given object implements the GraphUpdateResponse interface.
 */
export function instanceOfGraphUpdateResponse(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'graph' in value;

  return isInstance;
}

export function GraphUpdateResponseFromJSON(json: any): GraphUpdateResponse {
  return GraphUpdateResponseFromJSONTyped(json, false);
}

export function GraphUpdateResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GraphUpdateResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    graph: GraphContentFromJSON(json['graph']),
  };
}

export function GraphUpdateResponseToJSON(value?: GraphUpdateResponse | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    graph: GraphContentToJSON(value.graph),
  };
}
