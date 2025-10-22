import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { getWompiConfig } from '../config/wompi.config';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TokenizeCardDto } from './dto/tokenize-card.dto';

@Injectable()
export class PaymentsService {
  private readonly wompi;

  constructor(private readonly configService: ConfigService) {
    this.wompi = getWompiConfig(this.configService);
  }

  async getAcceptanceToken() {
    try {
      const response = await axios.get(
        `${this.wompi.apiUrl}/merchants/${this.wompi.publicKey}`
      );
      return {
        acceptance_token: response.data.data.presigned_acceptance.acceptance_token,
        permalink: response.data.data.presigned_acceptance.permalink,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error getting acceptance token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async tokenizeCard(cardData: TokenizeCardDto) {
    try {
      const response = await axios.post(
        `${this.wompi.apiUrl}/tokens/cards`,
        cardData,
        {
          headers: {
            Authorization: `Bearer ${this.wompi.publicKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error tokenizing card',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async createTransaction(transactionData: CreateTransactionDto) {
    try {
      const response = await axios.post(
        `${this.wompi.apiUrl}/transactions`,
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${this.wompi.privateKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error creating transaction',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getTransaction(transactionId: string) {
    try {
      const response = await axios.get(
        `${this.wompi.apiUrl}/transactions/${transactionId}`
      );
      return response.data.data;
    } catch (error) {
      throw new HttpException(
        'Transaction not found',
        HttpStatus.NOT_FOUND
      );
    }
  }

  verifyWebhookSignature(signature: string, timestamp: string, payload: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.wompi.integrityKey)
      .update(`${timestamp}.${payload}`)
      .digest('hex');
    return signature === expectedSignature;
  }
}

