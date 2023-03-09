import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../shared/decorators/public.decorator';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { PaymentUrlDTO } from './dto/payment-url.dto';
import { PaymentService } from './payment.service';

@Controller(PaymentController.PAYMENT_API_ROUTE)
export class PaymentController {
  public static readonly PAYMENT_API_ROUTE = '/payment';
  public static readonly STRIPE_WEBHOOK_API_ROUTE = '/stripe-webhook';

  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  public createPayment(@Body() dto: CreatePaymentDTO): Promise<PaymentUrlDTO> {
    return this.paymentService.createPayment(dto);
  }

  @Public()
  @Post(PaymentController.STRIPE_WEBHOOK_API_ROUTE)
  public stripeWebhook(@Body() body: any) {
    this.paymentService.handleStripeWebhook(body);
  }
}
