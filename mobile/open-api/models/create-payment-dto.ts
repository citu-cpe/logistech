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
 * @interface CreatePaymentDTO
 */
export interface CreatePaymentDTO {
  /**
   *
   * @type {number}
   * @memberof CreatePaymentDTO
   */
  amount: number;
  /**
   *
   * @type {string}
   * @memberof CreatePaymentDTO
   */
  orderId: string;
  /**
   *
   * @type {boolean}
   * @memberof CreatePaymentDTO
   */
  isMobile?: boolean;
}
