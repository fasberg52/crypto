import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/paginations.dto';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { OrderStatusEnum } from '../enums/order.enum';

export class GetAllOrderDto extends PaginationDto {
  @ApiProperty()
  @IsString()
  symbol: string;

  @ApiProperty({ enum: OrderStatusEnum, enumName: 'OrderStatusEnum' })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiPropertyOptional({ default: 'id' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  sort?: string;

  @ApiPropertyOptional({ default: 'DESC' })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @Transform(({ value }) => value.toUpperCase().trim())
  @ApiProperty()
  sortOrder: string;
}
