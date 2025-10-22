import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionStatus } from './entities/transaction.entity';
import { NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction with PENDING status', () => {
      const data = {
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      };

      const transaction = service.create(data);

      expect(transaction).toBeDefined();
      expect(transaction.id).toBeDefined();
      expect(transaction.status).toBe(TransactionStatus.PENDING);
      expect(transaction.productId).toBe(data.productId);
      expect(transaction.amount).toBe(data.amount);
    });

    it('should generate unique IDs for each transaction', () => {
      const data = {
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      };

      const tx1 = service.create(data);
      const tx2 = service.create(data);

      expect(tx1.id).not.toBe(tx2.id);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', () => {
      const created = service.create({
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      });

      const found = service.findOne(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
    });

    it('should throw NotFoundException for invalid id', () => {
      expect(() => service.findOne('invalid-id')).toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', () => {
      service.create({
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      });

      const transactions = service.findAll();

      expect(transactions).toBeInstanceOf(Array);
      expect(transactions.length).toBeGreaterThan(0);
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status', () => {
      const transaction = service.create({
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      });

      const updated = service.updateStatus(
        transaction.id,
        TransactionStatus.APPROVED,
      );

      expect(updated.status).toBe(TransactionStatus.APPROVED);
    });

    it('should update wompi data when provided', () => {
      const transaction = service.create({
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      });

      const wompiData = {
        wompiTransactionId: 'wompi-123',
        wompiReference: 'ref-123',
        paymentMethod: 'CARD',
      };

      const updated = service.updateStatus(
        transaction.id,
        TransactionStatus.APPROVED,
        wompiData,
      );

      expect(updated.wompiTransactionId).toBe(wompiData.wompiTransactionId);
      expect(updated.wompiReference).toBe(wompiData.wompiReference);
      expect(updated.paymentMethod).toBe(wompiData.paymentMethod);
    });

    it('should update the updatedAt timestamp', () => {
      const transaction = service.create({
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      });

      const oldDate = transaction.updatedAt;

      setTimeout(() => {
        const updated = service.updateStatus(
          transaction.id,
          TransactionStatus.APPROVED,
        );

        expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
          oldDate.getTime(),
        );
      }, 10);
    });
  });

  describe('findByWompiReference', () => {
    it('should find transaction by wompi reference', () => {
      const transaction = service.create({
        productId: '1',
        customerId: 'customer-1',
        customerEmail: 'test@test.com',
        amount: 50000,
        currency: 'COP',
      });

      service.updateStatus(transaction.id, TransactionStatus.APPROVED, {
        wompiReference: 'ref-123',
      });

      const found = service.findByWompiReference('ref-123');

      expect(found).toBeDefined();
      expect(found?.id).toBe(transaction.id);
    });

    it('should return undefined for non-existent reference', () => {
      const found = service.findByWompiReference('non-existent');
      expect(found).toBeUndefined();
    });
  });
});

