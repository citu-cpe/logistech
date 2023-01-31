import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getOutgoingTransactionsForCompany(companyId: string) {
    await this.prismaService.transaction.findMany({
      where: {
        sendingCompanyId: companyId,
      },
    });
  }

  public async getIncomingTransactionsForCompany(companyId: string) {
    await this.prismaService.transaction.findMany({
      where: {
        receivingCompanyId: companyId,
      },
    });
  }

  // public async createTransaction(transaction: CreateTransactionDTO) {
  // const total = transaction.productItems.reduce(
  //   (sum, product) => sum + product.price,
  //   0
  // );
  // await this.prismaService.transaction.create({
  //   data: {
  //     sendingCompanyId: transaction.sendingCompanyId,
  //     receivingCompanyId: transaction.receivingCompanyId,
  //     total,
  //   },
  // });
  // }
}
