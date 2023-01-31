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

/**
 *
 * @export
 * @interface UserDTO
 */
export interface UserDTO {
  /**
   *
   * @type {string}
   * @memberof UserDTO
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof UserDTO
   */
  createdAt: string;
  /**
   *
   * @type {string}
   * @memberof UserDTO
   */
  updatedAt: string;
  /**
   *
   * @type {string}
   * @memberof UserDTO
   */
  email: string;
  /**
   *
   * @type {string}
   * @memberof UserDTO
   */
  username: string;
  /**
   *
   * @type {CompanyDTO}
   * @memberof UserDTO
   */
  company?: CompanyDTO;
  /**
   *
   * @type {string}
   * @memberof UserDTO
   */
  role: UserDTORoleEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum UserDTORoleEnum {
  Customer = 'CUSTOMER',
  SupplierPackagingPersonnel = 'SUPPLIER_PACKAGING_PERSONNEL',
  SupplierSalesInCharge = 'SUPPLIER_SALES_IN_CHARGE',
  SupplierLogisticsInCharge = 'SUPPLIER_LOGISTICS_IN_CHARGE',
  SupplierSupervisor = 'SUPPLIER_SUPERVISOR',
  StorageFacilityCourierPersonnel = 'STORAGE_FACILITY_COURIER_PERSONNEL',
  StorageFacilityLogisticsInCharge = 'STORAGE_FACILITY_LOGISTICS_IN_CHARGE',
  StorageFacilitySupervisor = 'STORAGE_FACILITY_SUPERVISOR',
  ManufacturerPackagingPersonnel = 'MANUFACTURER_PACKAGING_PERSONNEL',
  ManufacturerSalesInCharge = 'MANUFACTURER_SALES_IN_CHARGE',
  ManufacturerLogisticsInCharge = 'MANUFACTURER_LOGISTICS_IN_CHARGE',
  ManufacturerCourierPersonnel = 'MANUFACTURER_COURIER_PERSONNEL',
  ManufacturerSupervisor = 'MANUFACTURER_SUPERVISOR',
  Courier = 'COURIER',
  RetailerSupervisor = 'RETAILER_SUPERVISOR',
}
