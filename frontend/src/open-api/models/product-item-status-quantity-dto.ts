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
 * @interface ProductItemStatusQuantityDTO
 */
export interface ProductItemStatusQuantityDTO {
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  onHold: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  inTransit: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  inStorage: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  toBePickedUp: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  complete: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  canceled: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  redFlag: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  orders: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  returning: number;
  /**
   *
   * @type {number}
   * @memberof ProductItemStatusQuantityDTO
   */
  returned: number;
}
