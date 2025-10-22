import { Controller, Get, Post, Body, Param, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TokenizeCardDto } from './dto/tokenize-card.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('acceptance-token')
  async getAcceptanceToken() {
    return this.paymentsService.getAcceptanceToken();
  }

  @Post('tokenize-card')
  async tokenizeCard(@Body() cardData: TokenizeCardDto) {
    return this.paymentsService.tokenizeCard(cardData);
  }

  @Post('create')
  async createTransaction(@Body() transactionData: CreateTransactionDto) {
    return this.paymentsService.createTransaction(transactionData);
  }

  @Get('transaction/:id')
  async getTransaction(@Param('id') id: string) {
    return this.paymentsService.getTransaction(id);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('x-signature') signature: string,
    @Headers('x-timestamp') timestamp: string,
    @Body() payload: any,
  ) {
    const isValid = this.paymentsService.verifyWebhookSignature(
      signature,
      timestamp,
      JSON.stringify(payload),
    );

    if (!isValid) {
      return { error: 'Invalid signature' };
    }

    console.log('Webhook event:', payload.event);
    console.log('Transaction status:', payload.data?.transaction?.status);

    return { received: true };
  }
}

