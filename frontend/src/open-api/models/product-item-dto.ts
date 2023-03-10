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

import { ProductDTO } from './product-dto';

/**
 *
 * @export
 * @interface ProductItemDTO
 */
export interface ProductItemDTO {
  /**
   *
   * @type {string}
   * @memberof ProductItemDTO
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof ProductItemDTO
   */
  createdAt: string;
  /**
   *
   * @type {string}
   * @memberof ProductItemDTO
   */
  updatedAt: string;
  /**
   *
   * @type {string}
   * @memberof ProductItemDTO
   */
  rfid: string;
  /**
   *
   * @type {string}
   * @memberof ProductItemDTO
   */
  status: ProductItemDTOStatusEnum;
  /**
   *
   * @type {ProductDTO}
   * @memberof ProductItemDTO
   */
  product?: ProductDTO;
}

/**
 * @export
 * @enum {string}
 */
export enum ProductItemDTOStatusEnum {
  InStorage = 'IN_STORAGE',
  ToBePickedUp = 'TO_BE_PICKED_UP',
  OnHold = 'ON_HOLD',
  InTransit = 'IN_TRANSIT',
  Complete = 'COMPLETE',
  Canceled = 'CANCELED',
  RedFlag = 'RED_FLAG',
}
