import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [PaymentsModule, ProductsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

