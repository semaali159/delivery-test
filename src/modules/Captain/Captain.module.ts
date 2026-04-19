import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaptainController } from './Captain.controller';
import { CaptainService } from './Captain.service';
import { Captain, CaptainSchema } from './Captain.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Captain.name, schema: CaptainSchema }]),
  ],
  controllers: [CaptainController],
  providers: [CaptainService],
  exports: [CaptainService], 
})
export class CaptainsModule {}