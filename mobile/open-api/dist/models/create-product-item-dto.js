"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductItemDTOStatusEnum = void 0;
/**
 * @export
 * @enum {string}
 */
var CreateProductItemDTOStatusEnum;
(function (CreateProductItemDTOStatusEnum) {
    CreateProductItemDTOStatusEnum["InStorage"] = "IN_STORAGE";
    CreateProductItemDTOStatusEnum["ToBePickedUp"] = "TO_BE_PICKED_UP";
    CreateProductItemDTOStatusEnum["OnHold"] = "ON_HOLD";
    CreateProductItemDTOStatusEnum["InTransit"] = "IN_TRANSIT";
    CreateProductItemDTOStatusEnum["Complete"] = "COMPLETE";
    CreateProductItemDTOStatusEnum["Canceled"] = "CANCELED";
    CreateProductItemDTOStatusEnum["RedFlag"] = "RED_FLAG";
})(CreateProductItemDTOStatusEnum = exports.CreateProductItemDTOStatusEnum || (exports.CreateProductItemDTOStatusEnum = {}));
