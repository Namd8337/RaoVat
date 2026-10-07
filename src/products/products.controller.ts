import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { JwtAuthGuard } from '../auth/jwt.guard.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async getAllProducts() {
    return await this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
@Get('my')
async getMyProducts(@Req() req: any) {
  return await this.productsService.findMyProducts(
    req.user.sub,
  );
}

@Get('search')
async searchProducts(@Query('keyword') keyword: string) {
  return await this.productsService.search(keyword);
}

@Get('filter')
async filterProducts(
  @Query('minPrice') minPrice?: string,
  @Query('maxPrice') maxPrice?: string,
) {
  return await this.productsService.filterByPrice(
    minPrice ? Number(minPrice) : undefined,
    maxPrice ? Number(maxPrice) : undefined,
  );
}
@Get('category/:categoryId')
async getProductsByCategory(
  @Param('categoryId') categoryId: string,
) {
  return await this.productsService.findByCategory(
    Number(categoryId),
  );
}
  @Get(':id')
  async getProductById(
    @Param('id') id: string,
  ) {
    return await this.productsService.findOne(
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    return this.productsService.create(
      createProductDto,
      req.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
@Put(':id')
async updateProduct(
  @Param('id') id: string,
  @Body() updateData: any,
  @Req() req: any,
) {
  return await this.productsService.update(
    Number(id),
    updateData,
    req.user,
  );
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
async deleteProduct(
  @Param('id') id: string,
  @Req() req: any,
) {
  await this.productsService.remove(
    Number(id),
    req.user,
  );
  
  return {
    message: 'Đã xóa sản phẩm thành công',
  };
}
}