import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaptainsModule } from './modules/Captain/Captain.module';
import { OrdersModule } from './modules/Order/Order.module';
import { SocketModule } from './modules/socket/Socket.module';
import { ReportsModule } from './modules/report/Report.module'
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './common/config/config';
import { validationSchema } from './common/config/Validation.schema';
import { PartnerModule } from './modules/Partner/Partner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[config],
      validationSchema:validationSchema
    }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService)=>({
        uri: config.get('mongo.uri')
      })
    }),
    CaptainsModule,
    OrdersModule,
    SocketModule,
    ReportsModule,
    PartnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}