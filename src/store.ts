import { reactive, readonly } from "vue";

type IState = {
  loading: boolean;
  authenticated: boolean;
  token: string | null;
};

export default class Store {
  protected state: IState;

  constructor(data: IState) {
    this.state = reactive(data) as IState;
  }

  public getState() {
    return readonly(this.state) as IState;
  }

  public authenticated(token: string) {
    this.state.token = token;
    this.state.authenticated = true;
    localStorage.setItem("token", token);
  }
}
