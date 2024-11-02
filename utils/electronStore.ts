import { ipcMain, ipcRenderer } from "electron";
import type { IpcRenderer } from "electron";
import ElectronStore from "electron-store";

/** This definition is missing in lib.es2015.proxy.d.ts.
 * A proxy + handler may construct a different type than the proxy's target. */
declare global {
  interface ProxyConstructor {
    new <TSource extends object, TTarget extends object>(
      target: TSource,
      handler: ProxyHandler<TSource>,
    ): TTarget;
  }
}

const electronStoreProxyHandler = <TTarget>() => ({
  set<K extends keyof TTarget>(
    target: ElectronStore<Partial<TTarget>>,
    prop: K,
    value: TTarget[K],
  ): boolean {
    target.set(prop, value);
    return true;
  },
  get<K extends keyof TTarget>(
    target: ElectronStore<Partial<TTarget>>,
    prop: K,
  ): TTarget[K] | undefined {
    return target.get(prop);
  },
});

const ipcRendererProxyHandler = <TTarget>(name: string) => ({
  set<K extends keyof TTarget>(
    target: IpcRenderer,
    prop: K,
    value: TTarget[K],
  ): boolean {
    target.sendSync(`${name}: set-config`, prop, value);
    return true;
  },
  get<K extends keyof TTarget>(
    target: IpcRenderer,
    prop: K,
  ): TTarget[K] | undefined {
    // This blocks the renderer, so don't use it for heavy operations.
    // The asynchronous method is better, but the proxy handler needs to be synchronous.
    return target.sendSync(`${name}: get-config`, prop);
  },
});

/** Create transparent proxy that stores an object of type TTarget in an ElectronStore,
 * but accesses it as if it were the original object */
export const useElectronStoreWithIpcMain = <
  TTarget extends Record<string | symbol, unknown>,
>(
  name: string,
) => {
  const store = new ElectronStore<Partial<TTarget>>({ name });
  ipcMain.on(`${name}: set-config`, (_, key, value) => store.set(key, value));
  ipcMain.on(
    `${name}: get-config`,
    (ev, key) => (ev.returnValue = store.get(key)),
  );
  return new Proxy<ElectronStore<Partial<TTarget>>, TTarget>(
    store,
    electronStoreProxyHandler<TTarget>(),
  );
};

/** Create transparent proxy that stores an object of type TTarget in an ElectronStore,
 * but accesses it as if it were the original object */
export const useIpcRendererElectronStore = <
  TTarget extends Record<string | symbol, unknown>,
>(
  name: string,
) =>
  new Proxy<IpcRenderer, TTarget>(
    ipcRenderer,
    ipcRendererProxyHandler<TTarget>(name),
  );
