import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(1080)
export class NotificationGateway {
  @WebSocketServer()
  public server!: Server;

  @SubscribeMessage('message')
  public handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
