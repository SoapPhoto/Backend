import setupSocket from '@lib/common/sockets';
import { getNotificationList } from '@lib/services/notification';
import { observable, action } from 'mobx';
import { NotificationEntity } from '@lib/common/interfaces/notification';

export class NotificationStore {
  public io?: SocketIOClient.Socket;

  @observable public list: NotificationEntity[] = [];

  @observable public unread = 0;

  @observable public loading = true

  @observable public listInit = false

  private waitQueue: NotificationEntity[] = []

  private init = false

  public close = () => this.io && this.io.close()

  public createSocket = () => {
    if (!this.init) {
      this.init = true;
      this.io = setupSocket();
      this.message();
    }
  }

  public message = () => {
    const socket = this.io!;
    socket.on('message', (data: any) => {
      if (data.event === 'message') {
        this.pushNotification(data.data);
      } else {
        console.log(data);
      }
    });
  }

  public getList = async () => {
    this.setLoading(true);
    const { data } = await getNotificationList();
    this.setLoading(false);
    this.setList(data);
    this.pushWaitQueue();
  }

  @action
  public setList = (list: NotificationEntity[]) => {
    this.listInit = true;
    this.list = list;
  }

  @action
  public pushNotification = (data: NotificationEntity) => {
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
}
