// NOTE: This file does not export a Pinia store definition for Vue.
// It returns a proxy to an ElectronStore that can be used from both Vue and Electron to store desktop app window configuration
import {
  useIpcRendererElectronStore,
  useElectronStoreWithIpcMain,
} from "../utils/electronStore";

export type WindowConfig = {
  bounds: Partial<Electron.Rectangle> | undefined;
  closeToTray: boolean;
};

export const rendererWindowStore = () =>
  useIpcRendererElectronStore<WindowConfig>("window");
export const mainWindowStore = () =>
  useElectronStoreWithIpcMain<WindowConfig>("window");
