

import { IsOptional, IsEnum, IsString, IsDateString, IsMongoId, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class OrderQueryDto {
  @IsOptional()
  @IsEnum(['created', 'assigned', 'picked_up', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsMongoId()
  captainId?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;       

  @IsOptional()
  @IsDateString()
  toDate?: string;        

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  assigned?: boolean;      

  @IsOptional()
  @IsString()
  search?: string;     

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 20)
  limit: number = 20;

  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'status', 'orderNumber'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}