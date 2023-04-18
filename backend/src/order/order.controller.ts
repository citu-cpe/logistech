import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { CartDTO } from '../cart/dto/cart.dto';
import { ChartDataService } from './chart-data.service';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';
import { ManufacturerChartDataDTO } from './dto/manufacturer-chart-data.dto';
import { OrderDTO } from './dto/order.dto';
import { RetailerChartDataDTO } from './dto/retailer-chart-data.dto';
import { SalesDTO } from './dto/sales.dto';
import { StorageFacilityChartDataDTO } from './dto/storage-facility-chart-data.dto';
import { SupplierChartDataDTO } from './dto/supplier-chart-data.dto';
import { UpdateOrderStatusDTO } from './dto/update-order-status.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { OrderItemService } from './order-item.service';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  public static readonly ORDER_API_ROUTE = '/order';
  public static readonly ORDER_ID_API_ROUTE = '/order/:orderId';
  public static readonly ORDER_ITEM_API_ROUTE = '/order-item/:orderItemId';
  public static readonly COMPANY_API_ROUTE = '/company/:companyId';
  public static readonly SALES_API_ROUTE = '/sales';

  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly chartDataService: ChartDataService
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

  @Post(OrderController.ORDER_API_ROUTE + '/user')
  public createOrdersForCustomer(
    @Req() { user }: RequestWithUser,
    @Body() dto: CartDTO
  ): Promise<void> {
    return this.orderService.createOrders(dto, undefined, user.id);
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

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      '/storage-facility'
  )
  public getOrdersForStorageFacility(
    @Param('companyId') companyId: string
  ): Promise<OrderDTO[]> {
    return this.orderService.getOrdersForStorageFacility(companyId);
  }

  @Patch(OrderController.ORDER_API_ROUTE + '/:orderId/status')
  public updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderStatusDTO
  ): Promise<void> {
    return this.orderService.updateOrderStatus(orderId, dto.status);
  }

  @Put(OrderController.ORDER_API_ROUTE + '/:orderId')
  public updateOrder(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDTO
  ): Promise<void> {
    return this.orderService.updateOrder(orderId, dto);
  }

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      OrderController.SALES_API_ROUTE
  )
  public getSales(@Param('companyId') companyId: string): Promise<SalesDTO[]> {
    return this.orderItemService.getSales(companyId);
  }

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      '/supplier-chart-data'
  )
  public getSupplierChartData(
    @Param('companyId') companyId: string
  ): Promise<SupplierChartDataDTO[]> {
    return this.chartDataService.getSupplierChartData(companyId);
  }

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      '/manufacturer-chart-data'
  )
  public getManufacturerChartData(
    @Param('companyId') companyId: string
  ): Promise<ManufacturerChartDataDTO[]> {
    return this.chartDataService.getManufacturerChartData(companyId);
  }

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      '/retailer-chart-data'
  )
  public getRetailerChartData(
    @Param('companyId') companyId: string
  ): Promise<RetailerChartDataDTO[]> {
    return this.chartDataService.getRetailerChartData(companyId);
  }

  @Get(
    OrderController.ORDER_API_ROUTE +
      OrderController.COMPANY_API_ROUTE +
      '/storage-facility-chart-data'
  )
  public getStorageFacilityChartData(
    @Param('companyId') companyId: string
  ): Promise<StorageFacilityChartDataDTO[]> {
    return this.chartDataService.getStorageFacilityChartData(companyId);
  }
}
