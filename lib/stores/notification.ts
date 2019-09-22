import setupSocket from '@lib/common/sockets';
import { getNotificationList } from '@lib/services/notification';
import { observable, action } from 'mobx';
import { NotificationEntity } from '@lib/common/interfaces/notification';

export class NotificationStore {
  @observable public list: NotificationEntity[] = [];

  private init = false

  public createSocket = () => {
    if (!this.init) {
      this.init = true;
      setupSocket();
    }
  }

  public getList = async () => {
    const { data } = await getNotificationList();
    this.setList(data);
  }

  @action
  public setList = (list: NotificationEntity[]) => {
    this.list = list;
  }
}
