// socket.module.ts
import { Module } from '@nestjs/common';
import { CaptainLocationGateway } from './Location.gateway';
import { CaptainsModule } from '../Captain/Captain.module';

@Module({
  imports: [CaptainsModule], 
  providers: [CaptainLocationGateway],
  exports: [CaptainLocationGateway], 
})
export class SocketModule {}