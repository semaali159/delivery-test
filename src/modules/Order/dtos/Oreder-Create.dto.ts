import { IsString, IsNotEmpty, IsEnum, IsOptional, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'ORD-20250419-001' })
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty({ example: 'Sema Ali' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '+963995715237' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 'Hama' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 'Masyaf Castel' })
  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @ApiProperty()
  @IsLatitude()
  lat: number;

  @ApiProperty()
  @IsLongitude()
  lng: number;

  @ApiProperty({ required: false })
  @IsOptional()
  externalReference?: string;
}