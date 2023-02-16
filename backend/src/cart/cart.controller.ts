import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderItemDTO } from '../order/dto/create-order-item.dto';
import { CartService } from './cart.service';
import { CartDTO } from './dto/cart.dto';

@Controller(CartController.CART_API_ROUTE)
export class CartController {
  public static readonly CART_API_ROUTE = '/cart';
  public static readonly COMPANY_API_ROUTE = '/company/:companyId';

  constructor(private readonly cartService: CartService) {}

  @Post(CartController.COMPANY_API_ROUTE)
  public addItemToCart(
    @Param('companyId') companyId: string,
    @Body() dto: CreateOrderItemDTO
  ) {
    return this.cartService.addOrderItemToCart(companyId, dto);
  }

  @Get(CartController.COMPANY_API_ROUTE)
  public getCart(@Param('companyId') companyId: string): Promise<CartDTO> {
    return this.cartService.getCart(companyId);
  }
}
