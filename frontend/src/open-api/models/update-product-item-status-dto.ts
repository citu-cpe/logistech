/* tslint:disable */
/* eslint-disable */
/**
 * LogisTech
 * API for LogisTech
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface UpdateProductItemStatusDTO
 */
export interface UpdateProductItemStatusDTO {
  /**
   *
   * @type {string}
   * @memberof UpdateProductItemStatusDTO
   */
  status: UpdateProductItemStatusDTOStatusEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum UpdateProductItemStatusDTOStatusEnum {
  InStorage = 'IN_STORAGE',
  OnHold = 'ON_HOLD',
  ToBePickedUp = 'TO_BE_PICKED_UP',
  InTransitToStorageFacility = 'IN_TRANSIT_TO_STORAGE_FACILITY',
  InStorageFacility = 'IN_STORAGE_FACILITY',
  InTransitToBuyer = 'IN_TRANSIT_TO_BUYER',
  Complete = 'COMPLETE',
  Canceled = 'CANCELED',
  RedFlag = 'RED_FLAG',
  Returning = 'RETURNING',
  Returned = 'RETURNED',
}
