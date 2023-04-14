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
import { ProductItemDTO } from "./product-item-dto";
import { UserDTO } from "./user-dto";
/**
 *
 * @export
 * @interface ReportDTO
 */
export interface ReportDTO {
    /**
     *
     * @type {string}
     * @memberof ReportDTO
     */
    id: string;
    /**
     *
     * @type {string}
     * @memberof ReportDTO
     */
    createdAt: string;
    /**
     *
     * @type {string}
     * @memberof ReportDTO
     */
    updatedAt: string;
    /**
     *
     * @type {UserDTO}
     * @memberof ReportDTO
     */
    reportedBy: UserDTO;
    /**
     *
     * @type {string}
     * @memberof ReportDTO
     */
    description: string;
    /**
     *
     * @type {ProductItemDTO}
     * @memberof ReportDTO
     */
    productItem: ProductItemDTO;
}