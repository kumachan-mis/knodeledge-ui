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
/**
 * Request Parameters for Paper Find API
 * @export
 * @interface PaperFindRequest
 */
export interface PaperFindRequest {
  /**
   * User ID
   * @type {string}
   * @memberof PaperFindRequest
   */
  userId: string;
  /**
   * Auto-generated project ID
   * @type {string}
   * @memberof PaperFindRequest
   */
  projectId: string;
  /**
   * Auto-generated chapter ID
   * @type {string}
   * @memberof PaperFindRequest
   */
  chapterId: string;
}

/**
 * Check if a given object implements the PaperFindRequest interface.
 */
export function instanceOfPaperFindRequest(value: object): value is PaperFindRequest {
  if (!('userId' in value) || value['userId'] === undefined) return false;
  if (!('projectId' in value) || value['projectId'] === undefined) return false;
  if (!('chapterId' in value) || value['chapterId'] === undefined) return false;
  return true;
}

export function PaperFindRequestFromJSON(json: any): PaperFindRequest {
  return PaperFindRequestFromJSONTyped(json, false);
}

export function PaperFindRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PaperFindRequest {
  if (json == null) {
    return json;
  }
  return {
    userId: json['userId'],
    projectId: json['projectId'],
    chapterId: json['chapterId'],
  };
}

export function PaperFindRequestToJSON(json: any): PaperFindRequest {
  return PaperFindRequestToJSONTyped(json, false);
}

export function PaperFindRequestToJSONTyped(
  value?: PaperFindRequest | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    userId: value['userId'],
    projectId: value['projectId'],
    chapterId: value['chapterId'],
  };
}
