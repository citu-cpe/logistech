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
 * @interface CreateProductDTO
 */
export interface CreateProductDTO {
    /**
     *
     * @type {string}
     * @memberof CreateProductDTO
     */
    name: string;
    /**
     *
     * @type {number}
     * @memberof CreateProductDTO
     */
    price: number;
    /**
     *
     * @type {boolean}
     * @memberof CreateProductDTO
     */
    bulk: boolean;
    /**
     *
     * @type {number}
     * @memberof CreateProductDTO
     */
    bulkQuantity?: number;
}
