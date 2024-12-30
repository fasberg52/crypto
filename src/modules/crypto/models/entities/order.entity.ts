import { Column, Entity } from 'typeorm';
import { OrderStatusEnum } from '../../enums/order.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({ name: 'orders', schema: 'market' })
export class OrderEntity extends BaseEntity {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Column({ type: 'numeric', precision: 10, scale: 3 })
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.001)
  @Max(0.1)
  @Column({ type: 'numeric', precision: 10, scale: 3 })
  amount: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Column({ type: 'numeric', precision: 65, scale: 20 })
  total: number;

  @ApiProperty({ enum: OrderStatusEnum })
  @IsEnum(OrderStatusEnum)
  @Column({ type: 'enum', enum: OrderStatusEnum })
  status: OrderStatusEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Column({ type: 'varchar', length: 255 })
  symbol: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Column({ type: 'numeric', precision: 10, scale: 3 })
  liquidPrice: number;
}
