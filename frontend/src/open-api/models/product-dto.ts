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
import { OrderItemDTO } from './order-item-dto';

/**
 *
 * @export
 * @interface ProductDTO
 */
export interface ProductDTO {
  /**
   *
   * @type {string}
   * @memberof ProductDTO
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof ProductDTO
   */
  createdAt: string;
  /**
   *
   * @type {string}
   * @memberof ProductDTO
   */
  updatedAt: string;
  /**
   *
   * @type {string}
   * @memberof ProductDTO
   */
  name: string;
  /**
   *
   * @type {number}
   * @memberof ProductDTO
   */
  price: number;
  /**
   *
   * @type {number}
   * @memberof ProductDTO
   */
  numInStock: number;
  /**
   *
   * @type {boolean}
   * @memberof ProductDTO
   */
  bulk: boolean;
  /**
   *
   * @type {number}
   * @memberof ProductDTO
   */
  bulkQuantity?: number;
  /**
   *
   * @type {CompanyDTO}
   * @memberof ProductDTO
   */
  company?: CompanyDTO;
  /**
   *
   * @type {string}
   * @memberof ProductDTO
   */
  imageUrl?: string;
  /**
   *
   * @type {number}
   * @memberof ProductDTO
   */
  numInCart: number;
  /**
   *
   * @type {Array<OrderItemDTO>}
   * @memberof ProductDTO
   */
  orderItems?: Array<OrderItemDTO>;
}
