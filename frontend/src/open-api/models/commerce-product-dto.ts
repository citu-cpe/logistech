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
 * @interface CommerceProductDTO
 */
export interface CommerceProductDTO {
  /**
   *
   * @type {Array<string>}
   * @memberof CommerceProductDTO
   */
  companyTypes: Array<CommerceProductDTOCompanyTypesEnum>;
}

/**
 * @export
 * @enum {string}
 */
export enum CommerceProductDTOCompanyTypesEnum {
  StorageFacility = 'STORAGE_FACILITY',
  Supplier = 'SUPPLIER',
  Manufacturer = 'MANUFACTURER',
  Retailer = 'RETAILER',
}
