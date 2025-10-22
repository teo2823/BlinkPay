import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = [];

  create(data: {
    productId: string;
    customerId: string;
    customerEmail: string;
    amount: number;
    currency: string;
  }): Transaction {
    const transaction: Transaction = {
      id: uuidv4(),
      ...data,
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  findOne(id: string): Transaction {
    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  findAll(): Transaction[] {
    return this.transactions;
  }

  updateStatus(
    id: string,
    status: TransactionStatus,
    wompiData?: {
      wompiTransactionId?: string;
      wompiReference?: string;
      paymentMethod?: string;
      errorMessage?: string;
    },
  ): Transaction {
    const transaction = this.findOne(id);
    
    transaction.status = status;
    transaction.updatedAt = new Date();
    
    if (wompiData) {
      Object.assign(transaction, wompiData);
    }

    return transaction;
  }

  findByWompiReference(reference: string): Transaction | undefined {
    return this.transactions.find(t => t.wompiReference === reference);
  }
}

