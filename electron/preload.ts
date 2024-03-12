import { ipcRenderer } from "electron";

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("route-changed", (_event, url: string) => {
    window.dispatchEvent(new CustomEvent("route-changed", { detail: url }));
  });
});
