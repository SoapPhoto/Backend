import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as OAuth2Server from 'oauth2-server';
import { parse } from 'cookie';

import { OauthServerService } from '@server/modules/oauth/oauth-server/oauth-server.service';
import { WsException } from '@nestjs/websockets';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { UserEntity } from '@server/modules/user/user.entity';
import { NotificationService } from '@server/modules/notification/notification.service';

@Injectable()
export class EventsService {
  constructor(
    @Inject(forwardRef(() => OauthServerService))
    private readonly oauthServerService: OauthServerService,
    private readonly redisManager: RedisManager,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService
  ) {}

  public async getUserLoginInfo(cookie: string): Promise<UserEntity> {
    try {
      const data = await this.oauthServerService.server.authenticate(
        new OAuth2Server.Request({
          method: 'get',
          query: {},
          headers: {
            ...parse(cookie),
          },
        }),
        new OAuth2Server.Response({})
      );
      return data.user;
    } catch (err: any) {
      throw new WsException(err.message);
    }
  }

  public async login(clientId: string, user: UserEntity) {
    const redisClient = this.redisManager.getClient();
    await redisClient.set(
      `socket.login.${user.id}.${clientId}`,
      JSON.stringify({
        clientId,
        user,
      })
    );
  }

  public async logout(clientId: string) {
    const redisClient = this.redisManager.getClient();
    const keys = await redisClient.keys(`socket.login.*.${clientId}`);
    redisClient.del(...keys);
  }

  public async getClientId(userId: number) {
    const redisClient = this.redisManager.getClient();
    const data = await redisClient.keys(`socket.login.${userId}.*`);
    const arr = await Promise.all<string>(
      data.map(async (id) => {
        const infoStr = await redisClient.get(id);
        if (!infoStr) {
          return '';
        }
        const info = JSON.parse(infoStr);
        return info.clientId;
      })
    );
    return arr.filter(Boolean);
  }

  public getUnReadCount = async (user: UserEntity) =>
    this.notificationService.getUnReadCount(user);
}
