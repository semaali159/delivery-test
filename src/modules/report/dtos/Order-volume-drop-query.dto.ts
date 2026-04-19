import { IsDateString, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class OrderVolumeDropQueryDto {
  @IsDateString()
  previousFrom: string;

  @IsDateString()
  previousTo: string;

  @IsDateString()
  currentFrom: string;

  @IsDateString()
  currentTo: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  minPreviousOrders?: number = 5;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  minDropPercentage?: number = 30;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 20)
  limit: number = 20;

  @IsOptional()
  @IsEnum(['dropPercentage', 'dropCount', 'previousOrders', 'currentOrders'])
  sortBy: string = 'dropPercentage';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}