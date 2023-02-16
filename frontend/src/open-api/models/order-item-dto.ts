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

import { CartDTO } from './cart-dto';
import { OrderDTO } from './order-dto';
import { ProductDTO } from './product-dto';
import { ProductItemDTO } from './product-item-dto';

/**
 *
 * @export
 * @interface OrderItemDTO
 */
export interface OrderItemDTO {
  /**
   *
   * @type {string}
   * @memberof OrderItemDTO
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof OrderItemDTO
   */
  createdAt: string;
  /**
   *
   * @type {string}
   * @memberof OrderItemDTO
   */
  updatedAt: string;
  /**
   *
   * @type {number}
   * @memberof OrderItemDTO
   */
  quantity: number;
  /**
   *
   * @type {number}
   * @memberof OrderItemDTO
   */
  total: number;
  /**
   *
   * @type {CartDTO}
   * @memberof OrderItemDTO
   */
  cart?: CartDTO;
  /**
   *
   * @type {OrderDTO}
   * @memberof OrderItemDTO
   */
  order?: OrderDTO;
  /**
   *
   * @type {ProductDTO}
   * @memberof OrderItemDTO
   */
  product: ProductDTO;
  /**
   *
   * @type {Array<ProductItemDTO>}
   * @memberof OrderItemDTO
   */
  productItems?: Array<ProductItemDTO>;
}