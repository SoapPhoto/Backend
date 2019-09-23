import { Server, Socket } from 'socket.io';

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { LoggingService } from '@server/shared/logging/logging.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { EventsService } from './events.service';
// import { RedisService } from 'nestjs-redis';

interface IUserClientData {
  clientId: string;
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  public server!: Server;

  public data: Record<string, IUserClientData> = {};

  constructor(
    // private readonly redisService: RedisService,
    private readonly logger: LoggingService,
    private readonly eventsService: EventsService,
  ) {}

  public handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`, 'NotificationGateway');
  }

  public afterInit(_server: Server) {
    this.logger.log('Init', 'NotificationGateway');
  }

  public handleDisconnect(client: Socket) {
    this.eventsService.logout(client.id);
    this.logger.log(`Client disconnected: ${client.id}`, 'NotificationGateway');
  }

  @SubscribeMessage('CONNECT_USER')
  public async connectUser(client: Socket, _data: any) {
    const user = await this.eventsService.getUserLoginInfo(client.handshake.headers.cookie);
    await this.eventsService.login(client.id, user);
    return {
      event: 'CONNECT_USER',
      data: {
        unread: await this.eventsService.getUnReadCount(user),
      },
    };
  }

  @SubscribeMessage('notify')
  public notify(client: Socket, _data: any) {
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

  public async emitUserMessage<T>(user: UserEntity, event: string, data: T) {
    const ids = await this.eventsService.getClientId(user.id);
    if (ids.length === 0) {
      return;
    }
    await Promise.all(
      ids.map(async id => this.server.to(id).emit(event, data)),
    );
  }
}
