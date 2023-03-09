import { Controller } from '@nestjs/common';

@Controller(PaymentController.PAYMENT_API_ROUTE)
export class PaymentController {
  public static readonly PAYMENT_API_ROUTE = '/payment';
}
