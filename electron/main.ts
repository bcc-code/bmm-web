import {
  app,
  protocol,
  shell,
  dialog,
  BrowserWindow,
  nativeImage,
  net,
  ipcMain,
} from "electron";
import * as path from "path";
import * as fs from "fs/promises";
import { autoUpdater } from "electron-updater";
import ElectronStore from "electron-store";
import config from "../utils/config";

const PRODUCTION_APP_PROTOCOL = config.appProtocol;
const PRODUCTION_APP_PATH = path.join(__dirname);
const defaultUrl = `${PRODUCTION_APP_PROTOCOL}://${config.websiteDomain}`;
let initUrl = defaultUrl;
let appReadyHasRun = false;

const navigateToUri = (window: BrowserWindow, url: string) => {
  window.webContents.send("route-changed", url);
};
const store = new ElectronStore();

const removeUrlOrigin = (_url: string) => {
  const url = new URL(
    /^https?:\/\//.test(_url)
      ? _url
      : `http${_url.substring(_url.indexOf("://"))}`,
  );
  return url.href.substring(url.origin.length);
};

let window: BrowserWindow | undefined;
const openWindow = (url: string) => {
  if (!appReadyHasRun) {
    initUrl = url;
    return;
  }

  window = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: process.platform === "darwin" ? "hidden" : "default",
  });

  const previousTrack = {
    tooltip: "Previous", // TODO: figure out how to translate the tooltips
    icon: nativeImage.createFromPath(
      path.join(__dirname, "icons/icon.previous.track.png"),
    ),
    click() {
      window?.webContents.send("previous-track");
    },
  };

  const playTrack = {
    tooltip: "Play",
    icon: nativeImage.createFromPath(
      path.join(__dirname, "icons/icon.play.png"),
    ),
    click() {
      window?.webContents.send("play-track");
    },
  };

  const pauseTrack = {
    tooltip: "Pause",
    icon: nativeImage.createFromPath(
      path.join(__dirname, "icons/icon.pause.png"),
    ),
    click() {
      window?.webContents.send("pause-track");
    },
  };

  const nextTrack = {
    tooltip: "Next",
    icon: nativeImage.createFromPath(
      path.join(__dirname, "icons/icon.next.track.png"),
    ),
    click() {
      window?.webContents.send("next-track");
    },
  };

  ipcMain.on("set-thumb-bar-buttons", (_, mode: string) => {
    if (mode === "playing") {
      window?.setThumbarButtons([previousTrack, pauseTrack, nextTrack]);
    } else {
      window?.setThumbarButtons([previousTrack, playTrack, nextTrack]);
    }
  });

  const bounds = store.get("bounds");
  // restoring settings works fine on Mac. Maybe other environments need additional code to deal with changing monitor setups. See https://github.com/electron/electron/issues/526
  if (bounds) window.setBounds(bounds);

  window.webContents.on("will-navigate", (e, _url) => {
    // Some links from the API have the fixed domain `bmm.bcc.media` on the `http(s)` protocol. Use our router instead of navigating (which means reloading the "app").
    if (
      /^https?:\/\/bmm\.brunstad\.org\//.test(_url) ||
      /^https?:\/\/bmm\.bcc\.media\//.test(_url)
    ) {
      e.preventDefault();
      navigateToUri(window!, removeUrlOrigin(_url));
      return;
    }

    // Introduced to handle login-process in the default browser. A user usually has his login credentials already saved there.
    if (!_url.startsWith(`${PRODUCTION_APP_PROTOCOL}://`)) {
      e.preventDefault();
      shell.openExternal(_url).catch((error) => {
        dialog.showErrorBox(_url, `${error}`);
      });
    }
  });

  window.loadURL(url).catch((error) => {
    dialog.showErrorBox(url, `${error}`);
  });

  window.on("close", () => {
    store.set("bounds", window?.getBounds());
  });
  window.on("closed", () => {
    window = undefined;
  });
};

// Limit the app to a single instance and pass on arguments to the second instance (calls the "second-instance" event)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  const [, ...args] = [...process.argv];
  if (process.defaultApp) {
    if (args.length >= 1) {
      app.setAsDefaultProtocolClient(
        PRODUCTION_APP_PROTOCOL,
        process.execPath,
        [path.resolve(args.shift()!)],
      );
    }
  } else {
    app.setAsDefaultProtocolClient(PRODUCTION_APP_PROTOCOL);
  }

  // Expect the next parameter to be a URL
  if (args.length >= 1 && /^bmm:\/\//.test(args[0]!)) openWindow(args.shift()!);

  protocol.registerSchemesAsPrivileged([
    {
      scheme: PRODUCTION_APP_PROTOCOL,
      privileges: { secure: true, standard: true, supportFetchAPI: true },
    },
  ]);

  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(() => {
    if (process.env.VITE_DEV_SERVER_URL) {
      protocol.registerStreamProtocol(
        PRODUCTION_APP_PROTOCOL,
        (request, callback) => {
          net
            .request({
              method: request.method,
              url: `${process.env.VITE_DEV_SERVER_URL}${removeUrlOrigin(
                request.url,
              )}`,
            })
            .on("response", (response) => {
              callback(response);
            })
            .end();
        },
      );
    } else {
      protocol.registerFileProtocol(
        PRODUCTION_APP_PROTOCOL,
        (request, callback) => {
          const relativePath = path.normalize(new URL(request.url).pathname);
          const absolutePath = path.join(
            PRODUCTION_APP_PATH,
            relativePath !== path.sep ? relativePath : "index.html",
          );

          // Can the file be accessed? If yes, serve it. If not, it's most likely a route which we should resolve by opening index.html.
          fs.access(absolutePath)
            .then(() => fs.lstat(absolutePath))
            .then((stat) => {
              if (stat.isFile()) {
                // eslint-disable-next-line n/no-callback-literal
                callback({ path: absolutePath });
              } else {
                // eslint-disable-next-line no-throw-literal, @typescript-eslint/no-throw-literal
                throw undefined;
              }
            })
            .catch(() => {
              // eslint-disable-next-line n/no-callback-literal
              callback({ path: path.join(PRODUCTION_APP_PATH, "index.html") });
            });
        },
      );
    }

    appReadyHasRun = true;
    openWindow(initUrl);

    autoUpdater.checkForUpdatesAndNotify();
  });

  // Event is triggered when another program opens a `bmm://` link.
  app.on("open-url", (_, url) => {
    if (!window) {
      openWindow(url);
    } else if (/^bmm:\/\//.test(url)) {
      navigateToUri(window, removeUrlOrigin(url));
    } else {
      window.loadURL(url);
    }
  });

  app.on("second-instance", (_, commandLine) => {
    // What else would be the first argument ..?
    const url = commandLine.pop() || "";

    // Someone tried to run a second instance, we should focus our window.
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();

      if (/^bmm:\/\//.test(url)) {
        navigateToUri(window, removeUrlOrigin(url));
      } else {
        window.loadURL(url);
      }
    } else {
      openWindow(url);
    }
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  // On MacOS, if the icon in the dock is tapped ...
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      openWindow(defaultUrl);
    }
  });
}
