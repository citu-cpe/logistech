import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, Payment } from '@prisma/client';
import { OrderService } from '../order/order.service';
import { PaymentDTO } from './dto/payment.dto';
import Stripe from 'stripe';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { PaymentUrlDTO } from './dto/payment-url.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripe: Stripe,
    private readonly prismaService: PrismaService
  ) {}

  public async createPayment(dto: CreatePaymentDTO): Promise<PaymentUrlDTO> {
    const order = await this.prismaService.order.findUnique({
      where: { id: dto.orderId },
      include: { toCompany: true, payments: true },
    });

    const totalPaid = order.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const newTotalPaid = totalPaid + dto.amount;

    if (newTotalPaid > order.total) {
      throw new BadRequestException('Amount is more than remaining balance');
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'PHP',
            unit_amount: dto.amount * 100,
            product_data: {
              name: order.toCompany.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/orders?success=true`,
      cancel_url: `${process.env.BASE_URL}/orders?canceled=true`,
      metadata: { orderId: order.id, amount: dto.amount },
    });

    return { url: session.url };
  }

  public async handleStripeWebhook(body: any) {
    if (body.type === 'checkout.session.completed') {
      const data = body.data.object;
      await this.prismaService.payment.create({
        data: {
          amount: Number.parseFloat(data.metadata.amount),
          order: { connect: { id: data.metadata.orderId } },
        },
      });
    }
  }

  public static convertToDTO(payment: Payment & { order?: Order }): PaymentDTO {
    const order = !!payment.order && OrderService.convertToDTO(payment.order);

    return {
      id: payment.id,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      amount: payment.amount,
      orderId: payment.orderId,
      order,
    };
  }
}
