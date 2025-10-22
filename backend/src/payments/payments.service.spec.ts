import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PaymentsService', () => {
  let service: PaymentsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                WOMPI_SANDBOX_URL: 'https://api-sandbox.co.uat.wompi.dev/v1',
                WOMPI_PUBLIC_KEY: 'pub_test_123',
                WOMPI_PRIVATE_KEY: 'prv_test_123',
                WOMPI_EVENTS_KEY: 'events_123',
                WOMPI_INTEGRITY_KEY: 'integrity_123',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAcceptanceToken', () => {
    it('should return acceptance token', async () => {
      const mockResponse = {
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'token123',
              permalink: 'https://example.com',
            },
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.getAcceptanceToken();

      expect(result).toEqual({
        acceptance_token: 'token123',
        permalink: 'https://example.com',
      });
    });

    it('should throw HttpException on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getAcceptanceToken()).rejects.toThrow(HttpException);
    });
  });

  describe('tokenizeCard', () => {
    it('should tokenize a card successfully', async () => {
      const cardData = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'Test User',
      };

      const mockResponse = {
        data: {
          data: {
            id: 'tok_123',
            status: 'ACTIVE',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.tokenizeCard(cardData);

      expect(result).toEqual(mockResponse.data.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/tokens/cards'),
        cardData,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        }),
      );
    });

    it('should throw HttpException on tokenization error', async () => {
      const cardData = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'Test User',
      };

      mockedAxios.post.mockRejectedValue(new Error('Invalid card'));

      await expect(service.tokenizeCard(cardData)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const transactionData = {
        amount_in_cents: 5000000,
        currency: 'COP',
        customer_email: 'test@test.com',
        reference: 'TXN-123',
        payment_method: {
          type: 'CARD',
          token: 'tok_123',
        },
        acceptance_token: 'acc_123',
      };

      const mockResponse = {
        data: {
          data: {
            id: 'txn_123',
            status: 'APPROVED',
            reference: 'TXN-123',
            payment_method_type: 'CARD',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.createTransaction(transactionData);

      expect(result).toEqual(mockResponse.data.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/transactions'),
        transactionData,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        }),
      );
    });

    it('should throw HttpException on transaction error', async () => {
      const transactionData = {
        amount_in_cents: 5000000,
        currency: 'COP',
        customer_email: 'test@test.com',
        reference: 'TXN-123',
        payment_method: {
          type: 'CARD',
          token: 'tok_123',
        },
        acceptance_token: 'acc_123',
      };

      mockedAxios.post.mockRejectedValue(new Error('Transaction failed'));

      await expect(service.createTransaction(transactionData)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getTransaction', () => {
    it('should get transaction by id', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'txn_123',
            status: 'APPROVED',
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.getTransaction('txn_123');

      expect(result).toEqual(mockResponse.data.data);
    });

    it('should throw HttpException when transaction not found', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Not found'));

      await expect(service.getTransaction('invalid')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid webhook signature', () => {
      const signature = 'abc123';
      const timestamp = '1234567890';
      const payload = '{"event":"transaction.updated"}';

      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', 'integrity_123')
        .update(`${timestamp}.${payload}`)
        .digest('hex');

      const result = service.verifyWebhookSignature(
        expectedSignature,
        timestamp,
        payload,
      );

      expect(result).toBe(true);
    });

    it('should reject invalid webhook signature', () => {
      const result = service.verifyWebhookSignature(
        'invalid',
        '1234567890',
        '{}',
      );

      expect(result).toBe(false);
    });
  });
});

