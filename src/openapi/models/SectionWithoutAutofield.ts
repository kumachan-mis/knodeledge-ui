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
 * Section object without auto-generated fields
 * @export
 * @interface SectionWithoutAutofield
 */
export interface SectionWithoutAutofield {
  /**
   * Section name
   * @type {string}
   * @memberof SectionWithoutAutofield
   */
  name: string;
  /**
   * Section content
   * @type {string}
   * @memberof SectionWithoutAutofield
   */
  content: string;
}

/**
 * Check if a given object implements the SectionWithoutAutofield interface.
 */
export function instanceOfSectionWithoutAutofield(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'name' in value;
  isInstance = isInstance && 'content' in value;

  return isInstance;
}

export function SectionWithoutAutofieldFromJSON(json: any): SectionWithoutAutofield {
  return SectionWithoutAutofieldFromJSONTyped(json, false);
}

export function SectionWithoutAutofieldFromJSONTyped(json: any, ignoreDiscriminator: boolean): SectionWithoutAutofield {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    name: json['name'],
    content: json['content'],
  };
}

export function SectionWithoutAutofieldToJSON(value?: SectionWithoutAutofield | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
    content: value.content,
  };
}
