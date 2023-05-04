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
import { OrderItemDTO } from "./order-item-dto";
/**
 *
 * @export
 * @interface CreateOrderFromOrderItemsDTO
 */
export interface CreateOrderFromOrderItemsDTO {
    /**
     *
     * @type {Array<OrderItemDTO>}
     * @memberof CreateOrderFromOrderItemsDTO
     */
    orderItems: Array<OrderItemDTO>;
    /**
     *
     * @type {string}
     * @memberof CreateOrderFromOrderItemsDTO
     */
    owningCompanyId: string;
}
