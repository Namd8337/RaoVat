import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        `Không tìm thấy sản phẩm có ID ${id}`,
      );
    }

    return product;
  }
  async findMyProducts(userId: number): Promise<Product[]> {
  return await this.productsRepository.find({
    where: {
      userId,
    },
  });
}
  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const product = this.productsRepository.create({
      ...createProductDto,
      userId,
    });

    return this.productsRepository.save(product);
  }

  async update(
    id: number,
    data: Partial<CreateProductDto>,
    user: any,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Chỉ chủ bài hoặc admin mới được sửa
    if (user.role !== 'admin' && product.userId !== user.sub) {
      throw new ForbiddenException(
        'Bạn không có quyền sửa bài đăng này',
      );
    }

    Object.assign(product, data);

    return this.productsRepository.save(product);
  }

  async remove(
    id: number,
    user: any,
  ): Promise<void> {
    const product = await this.findOne(id);

    // Chỉ chủ bài hoặc admin mới được xóa
    if (user.role !== 'admin' && product.userId !== user.sub) {
      throw new ForbiddenException(
        'Bạn không có quyền xóa bài đăng này',
      );
    }

    await this.productsRepository.remove(product);
  }
  async search(keyword: string): Promise<Product[]> {
  return await this.productsRepository
    .createQueryBuilder('product')
    .where('product.name LIKE :keyword', {
      keyword: `%${keyword}%`,
    })
    .orWhere('product.description LIKE :keyword', {
      keyword: `%${keyword}%`,
    })
    .getMany();
}
async filterByPrice(
  minPrice?: number,
  maxPrice?: number,
): Promise<Product[]> {
  const query = this.productsRepository
    .createQueryBuilder('product');

  if (minPrice !== undefined) {
    query.andWhere('product.price >= :minPrice', {
      minPrice,
    });
  }
  

  
  if (maxPrice !== undefined) {
    query.andWhere('product.price <= :maxPrice', {
      maxPrice,
    });
  }

  return await query.getMany();
}
async findByCategory(categoryId: number): Promise<Product[]> {
  return await this.productsRepository.find({
    where: {
      categoryId,
    },
  });
}
}