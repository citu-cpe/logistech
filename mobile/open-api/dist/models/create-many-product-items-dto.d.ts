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
import { CreateProductItemDTO } from "./create-product-item-dto";
/**
 *
 * @export
 * @interface CreateManyProductItemsDTO
 */
export interface CreateManyProductItemsDTO {
    /**
     *
     * @type {Array<CreateProductItemDTO>}
     * @memberof CreateManyProductItemsDTO
     */
    productItems: Array<CreateProductItemDTO>;
}