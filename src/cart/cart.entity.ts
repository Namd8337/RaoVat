import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('cart_items')
@Index(['userId', 'productId'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Tài khoản sở hữu giỏ hàng
  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  // Sản phẩm được thêm vào giỏ
  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  // Số lượng sản phẩm
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}