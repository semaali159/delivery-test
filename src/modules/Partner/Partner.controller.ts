import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../Order/Order.service';
import { CreateOrderDto } from '../Order/dtos/Oreder-Create.dto';
import { PartnerApiKeyGuard } from './guards/Partner-api-key.gaurd'

@ApiTags('Partner')
@ApiHeader({ name: 'x-partner-api-key', required: true })
@Controller('partner')
@UseGuards(PartnerApiKeyGuard)
export class PartnerController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}