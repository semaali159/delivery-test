import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './Oreder-Create.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}