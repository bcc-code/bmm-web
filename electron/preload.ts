import { contextBridge, ipcRenderer } from "electron";

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("route-changed", (_event, url: string) => {
    window.dispatchEvent(new CustomEvent("route-changed", { detail: url }));
  });

  ipcRenderer.on("previous-track", () => {
    window.dispatchEvent(new Event("previousTrack"));
  });

  ipcRenderer.on("play-track", () => {
    window.dispatchEvent(new Event("playTrack"));
  });

  ipcRenderer.on("pause-track", () => {
    window.dispatchEvent(new Event("pauseTrack"));
  });

  ipcRenderer.on("next-track", () => {
    window.dispatchEvent(new Event("nextTrack"));
  });
});

contextBridge.exposeInMainWorld("electronAPI", {
  setThumbBarButtons: (mode: string) => {
    ipcRenderer.send("set-thumb-bar-buttons", mode);
  },
});
