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
 * Error Message for ProjectOnlyId object
 * @export
 * @interface ProjectOnlyIdError
 */
export interface ProjectOnlyIdError {
  /**
   * Error message for project ID
   * @type {string}
   * @memberof ProjectOnlyIdError
   */
  id?: string;
}

/**
 * Check if a given object implements the ProjectOnlyIdError interface.
 */
export function instanceOfProjectOnlyIdError(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function ProjectOnlyIdErrorFromJSON(json: any): ProjectOnlyIdError {
  return ProjectOnlyIdErrorFromJSONTyped(json, false);
}

export function ProjectOnlyIdErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectOnlyIdError {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
  };
}

export function ProjectOnlyIdErrorToJSON(value?: ProjectOnlyIdError | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
  };
}