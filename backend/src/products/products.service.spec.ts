import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', () => {
      const products = service.findAll();
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', () => {
      const product = service.findOne('1');
      expect(product).toBeDefined();
      expect(product.id).toBe('1');
    });

    it('should throw NotFoundException for invalid id', () => {
      expect(() => service.findOne('999')).toThrow(NotFoundException);
    });
  });

  describe('hasStock', () => {
    it('should return true if product has sufficient stock', () => {
      const hasStock = service.hasStock('1', 5);
      expect(hasStock).toBe(true);
    });

    it('should return false if product has insufficient stock', () => {
      const hasStock = service.hasStock('1', 1000);
      expect(hasStock).toBe(false);
    });
  });

  describe('updateStock', () => {
    it('should decrease stock when updating', () => {
      const product = service.findOne('1');
      const initialStock = product.stock;
      
      const updated = service.updateStock('1', 5);
      
      expect(updated.stock).toBe(initialStock - 5);
    });

    it('should throw error for insufficient stock', () => {
      expect(() => service.updateStock('1', 1000)).toThrow('Insufficient stock');
    });

    it('should update the updatedAt timestamp', () => {
      const product = service.findOne('1');
      const oldDate = product.updatedAt;
      
      setTimeout(() => {
        const updated = service.updateStock('1', 1);
        expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(oldDate.getTime());
      }, 10);
    });
  });
});

