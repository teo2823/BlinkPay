export class CreateTransactionDto {
  productId: string;
  customerId: string;
  customerEmail: string;
  quantity?: number;
}

export class ProcessPaymentDto {
  transactionId: string;
  cardToken: string;
  acceptanceToken: string;
}

