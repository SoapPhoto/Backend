import { observable, action } from 'mobx';
import { ApolloClient } from 'apollo-boost';

import { NotificationEntity } from '@lib/common/interfaces/notification';
import { queryToMobxObservable, watchQueryCacheObservable } from '@lib/common/apollo';
import { UserNotification, UnreadNotificationCount } from '@lib/schemas/query';
import { NewNotification } from '@lib/schemas/subscription';
import { MarkNotificationReadAll } from '@lib/schemas/mutations';
import Toast from '@lib/components/Toast';

export class NotificationStore {
  public io?: SocketIOClient.Socket;

  public client!: ApolloClient<any>;

  @observable public list: NotificationEntity[] = [];

  @observable public unread = 0;

  @observable public loading = true

  @observable public listInit = false

  private waitQueue: NotificationEntity[] = []

  private init = false

  public close = () => this.io && this.io.close()

  public setClient = (client: ApolloClient<any>) => this.client = client;

  public createSocket = () => {
    if (!this.init) {
      this.getUnread();
      this.client.subscribe<{newNotification: NotificationEntity}>({
        query: NewNotification,
      }).subscribe({
        next: (data) => {
          if (data.data) {
            this.pushNotification(data.data.newNotification);
          }
        },
        error: error => console.log(error),
      });
      // this.init = true;
      // this.io = setupSocket();
      // this.message();
    }
  }

  public getList = async () => {
    this.setLoading(true);
    await queryToMobxObservable(this.client.watchQuery<{userNotification: NotificationEntity[]}>({
      query: UserNotification,
    }), (data) => {
      this.setLoading(false);
      this.setList(data.userNotification);
      this.pushWaitQueue();
    });
  }

  public unReadAll = () => {
    this.unReadList();
    this.client.mutate({
      mutation: MarkNotificationReadAll,
    });
  }

  public getUnread = () => {
    queryToMobxObservable(this.client.watchQuery<{unreadNotificationCount: {count: number}}>({
      query: UnreadNotificationCount,
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      this.setUnRead(data.unreadNotificationCount.count);
    });
  }

  @action
  public unReadList = () => {
    this.unread = 0;
    this.list.forEach(notify => notify.read = true);
  }

  @action
  public setList = (list: NotificationEntity[]) => {
    this.listInit = true;
    this.list = list;
  }

  @action
  public pushNotification = (data: NotificationEntity) => {
    this.unread++;
    Toast.success('收到了新消息！');
    if (!this.loading) {
      this.list.unshift(data);
    } else {
      this.waitQueue.push(data);
    }
  }

  @action
  public pushWaitQueue = () => {
    for (let i = this.waitQueue.length - 1; i >= 0; i--) {
      if (this.list.findIndex(v => v.id === this.waitQueue[i].id) < 0) {
        this.list.unshift(this.waitQueue[i]);
      }
    }
    this.waitQueue = [];
  }

  @action
  public setLoading = (data: boolean) => this.loading = data;

  @action
  public setUnRead = (num: number) => this.unread = num;

  public watch = () => watchQueryCacheObservable(this.client.watchQuery<{userNotification: NotificationEntity[]}>({
    query: UserNotification,
    fetchPolicy: 'cache-only',
  }), (data) => {
    if (data.userNotification) {
      this.setList(data.userNotification);
    }
  }, {
    observable: true,
  })
}
