import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
