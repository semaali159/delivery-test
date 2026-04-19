import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CaptainQueryDto {
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsEnum(['online', 'offline'])
  availability?: 'online' | 'offline';

  @IsOptional()
  @IsString()
  search?: string; 

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @IsOptional()
  @IsEnum(['name', 'createdAt', 'status', 'availability'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}