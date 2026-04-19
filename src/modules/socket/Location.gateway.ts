import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaptainService } from '../Captain/Captain.service';
import { Injectable, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' }, 
  namespace: 'locations',
})
export class CaptainLocationGateway implements OnGatewayConnection,OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly captainService: CaptainService) {}
  async handleConnection(client: Socket) {
    const captainId = client.handshake.query.captainId as string;
    
    if (!captainId) {
      client.disconnect();
      return;
    }

    try {
      const captain = await this.captainService.validateCanBeAssigned(captainId);
      console.log(`Captain ${captain.name} connected`);
      
      client.join(`captain_${captainId}`);
    } catch (error) {
      client.disconnect();
    }
  }

  @SubscribeMessage('update_location')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { lat: number; lng: number },
  ) {
    // we can get the captainId from the token if we had authentication, but for simplicity we'll pass it as a query param during connection
    const captainId = client.handshake.query.captainId as string;

    
    await this.captainService.update(captainId, {
      currentLocation: {
        lat: data.lat,
        lng: data.lng,
        updatedAt: new Date(),
      },
      availability: 'online',
    } as any);
   
    this.server.emit('location_changed', {
      captainId,
      location: data,
      timestamp: new Date(),
    });
  }

  async handleDisconnect(client: Socket) {
        const captainId = client.handshake.query.captainId as string;

        if (!captainId) {
            console.warn(`Disconnected client missing captainId: ${client.id}`);
            return;
        }

        try {
            console.log(`Captain ${captainId} disconnected (socket: ${client.id})`);

            
            client.leave(`captain_${captainId}`);

            
            await this.captainService.update(captainId, {
              availability: 'offline',
            } as any);

            
            this.server.emit('captain_disconnected', {
                captainId,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error(`Error handling disconnect for captain ${captainId}:`, error);
        }
    }

}