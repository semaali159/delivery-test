import { IsString, IsPhoneNumber, IsEnum, IsOptional, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaptainDto {
  @ApiProperty({ example: 'Ahmed Mohamed' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+963995715237' })
  @IsPhoneNumber('SY')
  phone: string;

  @ApiProperty({})
  @IsString()
  vehicleType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLatitude()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLongitude()
  lng?: number;
}