import { Injectable } from '@nestjs/common';
import { Company, ProductItem, Transaction } from '@prisma/client';
import { CompanyService } from '../company/company.service';
import { ProductItemService } from '../product/product-item.service';
import { PrismaService } from '../global/prisma/prisma.service';
import { TransactionDTO } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getOutgoingTransactionsForCompany(companyId: string) {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        sendingCompanyId: companyId,
      },
      include: {
        receivingCompany: true,
        productItems: true,
      },
    });

    return transactions.map((t) => TransactionService.convertToDTO(t));
  }

  public async getIncomingTransactionsForCompany(companyId: string) {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        receivingCompanyId: companyId,
      },
      include: {
        sendingCompany: true,
        productItems: true,
      },
    });

    return transactions.map((t) => TransactionService.convertToDTO(t));
  }

  public static convertToDTO(
    transaction: Transaction & {
      sendingCompany?: Company;
      receivingCompany?: Company;
      productItems: ProductItem[];
    }
  ): TransactionDTO {
    return {
      ...transaction,
      sendingCompany:
        !!transaction.sendingCompany &&
        CompanyService.convertToDTO(transaction.sendingCompany),
      receivingCompany:
        !!transaction.receivingCompany &&
        CompanyService.convertToDTO(transaction.receivingCompany),
      productItems: transaction.productItems.map((p) =>
        ProductItemService.convertToDTO(p)
      ),
    };
  }
}
