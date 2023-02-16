import { Controller, Get, Param } from '@nestjs/common';
import { TransactionDTO } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller(TransactionController.TRANSACTION_API_ROUTE)
export class TransactionController {
  public static readonly TRANSACTION_API_ROUTE = '/transaction';
  public static readonly OUTGOING_API_ROUTE = '/outgoing/:companyId';
  public static readonly INCOMING_API_ROUTE = '/incoming/:companyId';

  constructor(private readonly transactionService: TransactionService) {}

  @Get(TransactionController.OUTGOING_API_ROUTE)
  public getOutgoingTransactionsForCompany(
    @Param('companyId') companyId: string
  ): Promise<TransactionDTO[]> {
    return this.transactionService.getOutgoingTransactionsForCompany(companyId);
  }

  @Get(TransactionController.INCOMING_API_ROUTE)
  public getIncomingTransactionsForCompany(
    @Param('companyId') companyId: string
  ): Promise<TransactionDTO[]> {
    return this.transactionService.getIncomingTransactionsForCompany(companyId);
  }
}
