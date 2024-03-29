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
import { OrderItemDTO } from "./order-item-dto";
import { UserDTO } from "./user-dto";

/**
 *
 * @export
 * @interface SalesItemDTO
 */
export interface SalesItemDTO {
  /**
   *
   * @type {CompanyDTO}
   * @memberof SalesItemDTO
   */
  customer?: CompanyDTO;
  /**
   *
   * @type {UserDTO}
   * @memberof SalesItemDTO
   */
  user?: UserDTO;
  /**
   *
   * @type {Array<OrderItemDTO>}
   * @memberof SalesItemDTO
   */
  orderItems: Array<OrderItemDTO>;
}
