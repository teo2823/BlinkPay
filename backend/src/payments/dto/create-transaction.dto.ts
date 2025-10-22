export class CreateTransactionDto {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  payment_method: {
    type: string;
    token?: string;
    installments?: number;
  };
  acceptance_token: string;
}

