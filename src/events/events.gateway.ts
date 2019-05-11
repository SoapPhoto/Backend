import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { map } from 'lodash';
import { from, Observable } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway(8081)
export class EventsGateway {
  @WebSocketServer()
  public server!: Server;

  @SubscribeMessage('message')
  public onEvent(client: any, data: any): WsResponse<number> {
    return {
      event: 'events',
      data: 1,
    };
  }
}
