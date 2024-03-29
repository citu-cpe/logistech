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

import { CompanyDTO } from "./company-dto";
import { OrderItemGroup } from "./order-item-group";

/**
 *
 * @export
 * @interface CartDTO
 */
export interface CartDTO {
  /**
   *
   * @type {string}
   * @memberof CartDTO
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof CartDTO
   */
  createdAt: string;
  /**
   *
   * @type {string}
   * @memberof CartDTO
   */
  updatedAt: string;
  /**
   *
   * @type {number}
   * @memberof CartDTO
   */
  total: number;
  /**
   *
   * @type {CompanyDTO}
   * @memberof CartDTO
   */
  company?: CompanyDTO;
  /**
   *
   * @type {Array<OrderItemGroup>}
   * @memberof CartDTO
   */
  groupedOrderItems: Array<OrderItemGroup>;
}
