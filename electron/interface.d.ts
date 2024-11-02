export interface IElectronAPI {
  setThumbBarButtons: (mode: string) => Promise<void>;
  closeToTray: boolean;
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
  }
}
