import { reactive, readonly } from "vue";

interface IState {}

export default class Store {
  protected state: IState;

  constructor(data: IState) {
    this.state = reactive(data);
  }

  public getState() {
    return readonly(this.state);
  }
}
