import { Injectable } from '@nestjs/common';
import { Order, Payment } from '@prisma/client';
import { OrderService } from '../order/order.service';
import { PaymentDTO } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  public static convertToDTO(payment: Payment & { order?: Order }): PaymentDTO {
    const order = !!payment.order && OrderService.convertToDTO(payment.order);

    return {
      id: payment.id,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      amount: payment.amount,
      order,
    };
  }
}
