import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Test product 1',
      price: 50000,
      stock: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Test product 2',
      price: 100000,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  updateStock(id: string, quantity: number): Product {
    const product = this.findOne(id);
    
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    product.stock -= quantity;
    product.updatedAt = new Date();
    
    return product;
  }

  hasStock(id: string, quantity: number = 1): boolean {
    const product = this.findOne(id);
    return product.stock >= quantity;
  }
}

