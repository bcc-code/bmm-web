import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("isElectron", true);

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("route-changed", (_event, url: string) => {
    window.dispatchEvent(new CustomEvent("route-changed", { detail: url }));
  });
});
