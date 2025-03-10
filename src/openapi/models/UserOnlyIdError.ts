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
 * Error Message for UserOnlyId object
 * @export
 * @interface UserOnlyIdError
 */
export interface UserOnlyIdError {
  /**
   * Error message for user ID
   * @type {string}
   * @memberof UserOnlyIdError
   */
  id?: string;
}

/**
 * Check if a given object implements the UserOnlyIdError interface.
 */
export function instanceOfUserOnlyIdError(value: object): value is UserOnlyIdError {
  return true;
}

export function UserOnlyIdErrorFromJSON(json: any): UserOnlyIdError {
  return UserOnlyIdErrorFromJSONTyped(json, false);
}

export function UserOnlyIdErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserOnlyIdError {
  if (json == null) {
    return json;
  }
  return {
    id: json['id'] == null ? undefined : json['id'],
  };
}

export function UserOnlyIdErrorToJSON(json: any): UserOnlyIdError {
  return UserOnlyIdErrorToJSONTyped(json, false);
}

export function UserOnlyIdErrorToJSONTyped(value?: UserOnlyIdError | null, ignoreDiscriminator: boolean = false): any {
  if (value == null) {
    return value;
  }

  return {
    id: value['id'],
  };
}
