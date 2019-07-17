import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, Server, Socket } from 'socket.io';

import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { LoggingService } from '@server/shared/logging/logging.service';
import { parse } from 'cookie';

interface IUserClientData {
  clientId: string;
}

@WebSocketGateway()
@UseGuards(AuthGuard)
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  public server!: Server;

  public data: Record<string, IUserClientData> = {};

  constructor(private readonly logger: LoggingService) {}

  public handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`, 'NotificationGateway');
  }

  public afterInit(server: Server) {
    this.logger.log('Init', 'NotificationGateway');
  }

  public handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`, 'NotificationGateway');
  }

  @Roles('user')
  @SubscribeMessage('CONNECT_USER')
  public connectUser(client: Socket, data: any) {
    console.log('CONNECT_USER', data);
    this.data[client.id] = {
      clientId: client.id,
    };
    return {
      event: 'CONNECT_USER',
      message: 'ok',
    };
  }

  @SubscribeMessage('notify')
  public notify(client: Socket, data: any) {
    return {
      event: 'notify',
      data: {
        client,
        hello: 'world',
      },
    };
  }

  public emitMessage<T>(event: string, data: T) {
    console.log(this.data);
    this.server.emit(event, data);
  }
}
