import { Module } from '@nestjs/common';
import { OrdersModule } from '../Order/Order.module';
import { PartnerController } from './Partner.controller';
import { PartnerApiKeyGuard } from './guards/Partner-api-key.gaurd';
@Module({
  imports: [OrdersModule],
  controllers: [PartnerController],
  providers: [PartnerApiKeyGuard],
})
export class PartnerModule {}