import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CartDTO } from '../cart/dto/cart.dto';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';
import { OrderDTO } from './dto/order.dto';
import { UpdateOrderStatusDTO } from './dto/update-order-status.dto';
import { OrderItemService } from './order-item.service';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  public static readonly ORDER_API_ROUTE = '/order';
  public static readonly ORDER_ID_API_ROUTE = '/order/:orderId';
  public static readonly ORDER_ITEM_API_ROUTE = '/order-item/:orderItemId';
  public static readonly COMPANY_API_ROUTE = '/company/:companyId';

  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService
  ) {}

  @Get(OrderController.ORDER_ID_API_ROUTE)
  public getOrderById(@Param('orderId') orderId: string): Promise<OrderDTO> {
    return this.orderService.getOrderById(orderId);
  }

  @Put(OrderController.ORDER_ITEM_API_ROUTE)
  public editOrderItem(
    @Param('orderItemId') orderItemId: string,
    @Body() dto: CreateOrderItemDTO
  ): Promise<void> {
    return this.orderItemService.editOrderItem(orderItemId, dto);
  }

  @Delete(OrderController.ORDER_ITEM_API_ROUTE)
  public deleteOrderItem(
    @Param('orderItemId') orderItemId: string
  ): Promise<void> {
    return this.orderItemService.deleteOrderItem(orderItemId);
  }

  @Post(OrderController.ORDER_API_ROUTE + OrderController.COMPANY_API_ROUTE)
  public createOrders(
    @Param('companyId') companyId: string,
    @Body() dto: CartDTO
  ): Promise<void> {
    return this.orderService.createOrders(dto, companyId);
  }

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      '/incoming'
  )
  public getIncomingOrders(
    @Param('companyId') companyId: string
  ): Promise<OrderDTO[]> {
    return this.orderService.getIncomingOrders(companyId);
  }

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      '/outgoing'
  )
  public getOutgoingOrders(
    @Param('companyId') companyId: string
  ): Promise<OrderDTO[]> {
    return this.orderService.getOutgoingOrders(companyId);
  }

  @Patch(OrderController.ORDER_API_ROUTE + '/:orderId')
  public updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderStatusDTO
  ): Promise<void> {
    return this.orderService.updateOrderStatus(orderId, dto.status);
  }
}
