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
import type { ProjectOnlyId } from './ProjectOnlyId';
import {
  ProjectOnlyIdFromJSON,
  ProjectOnlyIdFromJSONTyped,
  ProjectOnlyIdToJSON,
  ProjectOnlyIdToJSONTyped,
} from './ProjectOnlyId';
import type { SectionOnlyId } from './SectionOnlyId';
import {
  SectionOnlyIdFromJSON,
  SectionOnlyIdFromJSONTyped,
  SectionOnlyIdToJSON,
  SectionOnlyIdToJSONTyped,
} from './SectionOnlyId';
import type { ChapterOnlyId } from './ChapterOnlyId';
import {
  ChapterOnlyIdFromJSON,
  ChapterOnlyIdFromJSONTyped,
  ChapterOnlyIdToJSON,
  ChapterOnlyIdToJSONTyped,
} from './ChapterOnlyId';
import type { UserOnlyId } from './UserOnlyId';
import { UserOnlyIdFromJSON, UserOnlyIdFromJSONTyped, UserOnlyIdToJSON, UserOnlyIdToJSONTyped } from './UserOnlyId';

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
export function instanceOfGraphFindRequest(value: object): value is GraphFindRequest {
  if (!('user' in value) || value['user'] === undefined) return false;
  if (!('project' in value) || value['project'] === undefined) return false;
  if (!('chapter' in value) || value['chapter'] === undefined) return false;
  if (!('section' in value) || value['section'] === undefined) return false;
  return true;
}

export function GraphFindRequestFromJSON(json: any): GraphFindRequest {
  return GraphFindRequestFromJSONTyped(json, false);
}

export function GraphFindRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): GraphFindRequest {
  if (json == null) {
    return json;
  }
  return {
    user: UserOnlyIdFromJSON(json['user']),
    project: ProjectOnlyIdFromJSON(json['project']),
    chapter: ChapterOnlyIdFromJSON(json['chapter']),
    section: SectionOnlyIdFromJSON(json['section']),
  };
}

export function GraphFindRequestToJSON(json: any): GraphFindRequest {
  return GraphFindRequestToJSONTyped(json, false);
}

export function GraphFindRequestToJSONTyped(
  value?: GraphFindRequest | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value;
  }

  return {
    user: UserOnlyIdToJSON(value['user']),
    project: ProjectOnlyIdToJSON(value['project']),
    chapter: ChapterOnlyIdToJSON(value['chapter']),
    section: SectionOnlyIdToJSON(value['section']),
  };
}
