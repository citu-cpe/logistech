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

import { TokensDTO } from './tokens-dto';
import { UserDTO } from './user-dto';

/**
 *
 * @export
 * @interface LoginResponseDTO
 */
export interface LoginResponseDTO {
  /**
   *
   * @type {UserDTO}
   * @memberof LoginResponseDTO
   */
  user: UserDTO;
  /**
   *
   * @type {TokensDTO}
   * @memberof LoginResponseDTO
   */
  tokens: TokensDTO;
}
