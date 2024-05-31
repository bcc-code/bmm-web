export interface IElectronAPI {
  setThumbBarButtons: (mode: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
