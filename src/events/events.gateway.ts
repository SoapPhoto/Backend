import { Server, Socket } from 'socket.io';

import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { LoggingService } from '@server/shared/logging/logging.service';
import { RedisService } from 'nestjs-redis';
import { Role } from '@server/user/role.enum';

interface IUserClientData {
  clientId: string;
}

@UseGuards(AuthGuard)
@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  public server!: Server;

  public data: Record<string, IUserClientData> = {};

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggingService,
  ) {}

  public handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`, 'NotificationGateway');
  }

  public afterInit(server: Server) {
    this.logger.log('Init', 'NotificationGateway');
  }

  public handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`, 'NotificationGateway');
  }

  @Roles(Role.USER)
  @SubscribeMessage('CONNECT_USER')
  public async connectUser(client: Socket, data: any) {
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
    this.server.emit(event, data);
  }
}
