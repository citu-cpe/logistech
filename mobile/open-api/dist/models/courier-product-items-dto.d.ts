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
/**
 *
 * @export
 * @interface CourierProductItemsDTO
 */
export interface CourierProductItemsDTO {
    /**
     *
     * @type {Array<ProductItemDTO>}
     * @memberof CourierProductItemsDTO
     */
    inTransitProductItems: Array<ProductItemDTO>;
    /**
     *
     * @type {Array<ProductItemDTO>}
     * @memberof CourierProductItemsDTO
     */
    toBePickedUpProductItems: Array<ProductItemDTO>;
}
