export interface IElectronAPI {
  setThumbarBtns: (mode: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
