import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PaymentsService } from '../payments/payments.service';
import { ProductsService } from '../products/products.service';
import { CreateTransactionDto, ProcessPaymentDto } from './dto/create-transaction.dto';
import { TransactionStatus } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly paymentsService: PaymentsService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const { productId, customerId, customerEmail, quantity = 1 } = createTransactionDto;

    const product = this.productsService.findOne(productId);
    
    if (!this.productsService.hasStock(productId, quantity)) {
      throw new Error('Insufficient stock');
    }

    const transaction = this.transactionsService.create({
      productId,
      customerId,
      customerEmail,
      amount: product.price * quantity,
      currency: 'COP',
    });

    return {
      transactionId: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
    };
  }

  @Post('process-payment')
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    const { transactionId, cardToken, acceptanceToken } = processPaymentDto;

    const transaction = this.transactionsService.findOne(transactionId);

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error('Transaction is not in PENDING status');
    }

    try {
      const wompiTransaction = await this.paymentsService.createTransaction({
        amount_in_cents: transaction.amount * 100,
        currency: transaction.currency,
        customer_email: transaction.customerEmail,
        reference: `TXN-${transaction.id}`,
        payment_method: {
          type: 'CARD',
          token: cardToken,
        },
        acceptance_token: acceptanceToken,
      });

      const status = this.mapWompiStatus(wompiTransaction.status);
      
      this.transactionsService.updateStatus(transactionId, status, {
        wompiTransactionId: wompiTransaction.id,
        wompiReference: wompiTransaction.reference,
        paymentMethod: wompiTransaction.payment_method_type,
      });

      if (status === TransactionStatus.APPROVED) {
        this.productsService.updateStock(transaction.productId, 1);
        
        return {
          success: true,
          transactionId: transaction.id,
          status: 'APPROVED',
          message: 'Payment approved and product assigned',
          wompiTransactionId: wompiTransaction.id,
        };
      } else {
        return {
          success: false,
          transactionId: transaction.id,
          status: status,
          message: 'Payment was not approved',
        };
      }
    } catch (error) {
      this.transactionsService.updateStatus(transactionId, TransactionStatus.ERROR, {
        errorMessage: error.message,
      });

      throw error;
    }
  }

  @Get(':id')
  getTransaction(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Get()
  getAllTransactions() {
    return this.transactionsService.findAll();
  }

  private mapWompiStatus(wompiStatus: string): TransactionStatus {
    const statusMap = {
      APPROVED: TransactionStatus.APPROVED,
      DECLINED: TransactionStatus.DECLINED,
      PENDING: TransactionStatus.PENDING,
      ERROR: TransactionStatus.ERROR,
    };

    return statusMap[wompiStatus] || TransactionStatus.ERROR;
  }
}

