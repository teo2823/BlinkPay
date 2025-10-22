export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  ERROR = 'ERROR',
}

export class Transaction {
  id: string;
  productId: string;
  customerId: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  wompiTransactionId?: string;
  wompiReference?: string;
  paymentMethod?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

