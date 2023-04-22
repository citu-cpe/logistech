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
 * @interface CreateProductItemDTO
 */
export interface CreateProductItemDTO {
  /**
   *
   * @type {string}
   * @memberof CreateProductItemDTO
   */
  rfid: string;
  /**
   *
   * @type {string}
   * @memberof CreateProductItemDTO
   */
  status: CreateProductItemDTOStatusEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum CreateProductItemDTOStatusEnum {
  InStorage = 'IN_STORAGE',
  ToBePickedUp = 'TO_BE_PICKED_UP',
  OnHold = 'ON_HOLD',
  InTransit = 'IN_TRANSIT',
  Complete = 'COMPLETE',
  Canceled = 'CANCELED',
  RedFlag = 'RED_FLAG',
  Returning = 'RETURNING',
  Returned = 'RETURNED',
}
