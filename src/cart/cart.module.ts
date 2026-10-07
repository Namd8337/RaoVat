import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItem } from './cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
  ],
  controllers: [],
  providers: [],
  exports: [
    TypeOrmModule,
  ],
})
export class CartModule {}