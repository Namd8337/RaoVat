import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { User } from '../users/user.entity.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User]),

    JwtModule.register({
      secret: 'NEST_SECRET_JWT_2026',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}