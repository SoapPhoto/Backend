import { observable } from 'mobx';

export class AppStore {
  @observable public loading = false;
}
