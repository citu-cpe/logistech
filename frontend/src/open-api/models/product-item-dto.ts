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

import { CompanyDTO } from './company-dto';
import { ProductDTO } from './product-dto';
import { UserDTO } from './user-dto';

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
  rfid?: string;
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
  /**
   *
   * @type {UserDTO}
   * @memberof ProductItemDTO
   */
  customer?: UserDTO;
  /**
   *
   * @type {UserDTO}
   * @memberof ProductItemDTO
   */
  courier?: UserDTO;
  /**
   *
   * @type {CompanyDTO}
   * @memberof ProductItemDTO
   */
  buyer?: CompanyDTO;
}

/**
 * @export
 * @enum {string}
 */
export enum ProductItemDTOStatusEnum {
  InStorage = 'IN_STORAGE',
  OnHold = 'ON_HOLD',
  ToBePickedUp = 'TO_BE_PICKED_UP',
  InTransitToStorageFacility = 'IN_TRANSIT_TO_STORAGE_FACILITY',
  InStorageFacility = 'IN_STORAGE_FACILITY',
  InTransitToBuyer = 'IN_TRANSIT_TO_BUYER',
  Complete = 'COMPLETE',
  Canceled = 'CANCELED',
  RedFlag = 'RED_FLAG',
  ReturnRequested = 'RETURN_REQUESTED',
  ReturnAccepted = 'RETURN_ACCEPTED',
  ReturnRejected = 'RETURN_REJECTED',
  InTransitToSeller = 'IN_TRANSIT_TO_SELLER',
  Returned = 'RETURNED',
}
