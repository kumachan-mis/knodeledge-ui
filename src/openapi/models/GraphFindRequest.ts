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
import type { ChapterOnlyId } from './ChapterOnlyId';
import { ChapterOnlyIdFromJSON, ChapterOnlyIdFromJSONTyped, ChapterOnlyIdToJSON } from './ChapterOnlyId';
import type { ProjectOnlyId } from './ProjectOnlyId';
import { ProjectOnlyIdFromJSON, ProjectOnlyIdFromJSONTyped, ProjectOnlyIdToJSON } from './ProjectOnlyId';
import type { SectionOnlyId } from './SectionOnlyId';
import { SectionOnlyIdFromJSON, SectionOnlyIdFromJSONTyped, SectionOnlyIdToJSON } from './SectionOnlyId';
import type { UserOnlyId } from './UserOnlyId';
import { UserOnlyIdFromJSON, UserOnlyIdFromJSONTyped, UserOnlyIdToJSON } from './UserOnlyId';

/**
 * Request Body for Graph Find API
 * @export
 * @interface GraphFindRequest
 */
export interface GraphFindRequest {
  /**
   *
   * @type {UserOnlyId}
   * @memberof GraphFindRequest
   */
  user: UserOnlyId;
  /**
   *
   * @type {ProjectOnlyId}
   * @memberof GraphFindRequest
   */
  project: ProjectOnlyId;
  /**
   *
   * @type {ChapterOnlyId}
   * @memberof GraphFindRequest
   */
  chapter: ChapterOnlyId;
  /**
   *
   * @type {SectionOnlyId}
   * @memberof GraphFindRequest
   */
  section: SectionOnlyId;
}

/**
 * Check if a given object implements the GraphFindRequest interface.
 */
export function instanceOfGraphFindRequest(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'user' in value;
  isInstance = isInstance && 'project' in value;
  isInstance = isInstance && 'chapter' in value;
  isInstance = isInstance && 'section' in value;

  return isInstance;
}

export function GraphFindRequestFromJSON(json: any): GraphFindRequest {
  return GraphFindRequestFromJSONTyped(json, false);
}

export function GraphFindRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): GraphFindRequest {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    user: UserOnlyIdFromJSON(json['user']),
    project: ProjectOnlyIdFromJSON(json['project']),
    chapter: ChapterOnlyIdFromJSON(json['chapter']),
    section: SectionOnlyIdFromJSON(json['section']),
  };
}

export function GraphFindRequestToJSON(value?: GraphFindRequest | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    user: UserOnlyIdToJSON(value.user),
    project: ProjectOnlyIdToJSON(value.project),
    chapter: ChapterOnlyIdToJSON(value.chapter),
    section: SectionOnlyIdToJSON(value.section),
  };
}