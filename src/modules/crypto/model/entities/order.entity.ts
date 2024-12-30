import { BaseEntity, Column, Entity } from 'typeorm';
import { OrderStatusEnum } from '../../enums/order.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'order', schema: 'market' })
export class OrderEntity extends BaseEntity {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @IsEnum(OrderStatusEnum)
  @Column({ type: 'enum', enum: OrderStatusEnum })
  status: OrderStatusEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255 })
  symbol: string;
}
