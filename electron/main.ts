import { app, protocol, shell, dialog, BrowserWindow, net } from "electron";
import * as path from "path";

const PRODUCTION_APP_PROTOCOL = "bmm";
const PRODUCTION_APP_PATH = path.join(__dirname, "..", ".output", "public");

app.setAsDefaultProtocolClient(PRODUCTION_APP_PROTOCOL);
protocol.registerSchemesAsPrivileged([
  {
    scheme: PRODUCTION_APP_PROTOCOL,
    privileges: { secure: true, standard: true, supportFetchAPI: true },
  },
]);

const navigateToUri = (window: BrowserWindow, url: string) => {
  window.webContents.send("route-changed", url);
};

const removeUrlOrigin = (_url: string) => {
  const url = new URL(
    /^https?:\/\//.test(_url)
      ? _url
      : `http${_url.substring(_url.indexOf("://"))}`
  );
  return url.href.substring(url.origin.length);
};

// Limit the app to a single instance and pass on arguments to the second instance (calls the "second-instance" event)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app
  .whenReady()
  .then(() => {
    if (process.env.VITE_DEV_SERVER_URL) {
      protocol.registerStreamProtocol(
        PRODUCTION_APP_PROTOCOL,
        (request, callback) => {
          net
            .request({
              method: request.method,
              url: `${process.env.VITE_DEV_SERVER_URL}${removeUrlOrigin(
                request.url
              )}`,
            })
            .on("response", (response) => {
              callback(response);
            })
            .end();
        }
      );
    } else {
      protocol.registerFileProtocol(
        PRODUCTION_APP_PROTOCOL,
        (request, callback) => {
          const relativePath = path.normalize(new URL(request.url).pathname);
          const absolutePath = path.join(
            PRODUCTION_APP_PATH,
            relativePath !== path.sep ? relativePath : "index.html"
          );

          // eslint-disable-next-line n/no-callback-literal, promise/no-callback-in-promise
          callback({ path: absolutePath });
        }
      );
    }

    const window = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    window.webContents.on("will-navigate", (e, url) => {
      // Some links from the API have the fixed domain `bmm.brunstad.org` on the `http(s)` protocol. Use our router instead of navigating (which means reloading the "app").
      if (/^https?:\/\/bmm\.brunstad\.org\//.test(url)) {
        e.preventDefault();
        navigateToUri(window, removeUrlOrigin(url));
        return;
      }

      // Introduced to handle login-process in the default browser. A user usually has his login credentials already saved there.
      if (!url.startsWith(`${PRODUCTION_APP_PROTOCOL}://`)) {
        e.preventDefault();
        shell.openExternal(url).catch((error) => {
          dialog.showErrorBox(url, `${error}`);
        });
      }
    });

    // Event is triggered when another program opens a `bmm://` link.
    app.on("open-url", (_, url) => {
      if (/^bmm:\/\//.test(url)) {
        navigateToUri(window, removeUrlOrigin(url));
      } else {
        window.loadURL(url);
      }
    });

    app.on("second-instance", (_, commandLine) => {
      // Someone tried to run a second instance, we should focus our window.
      if (window) {
        if (window.isMinimized()) window.restore();
        window.focus();
      }

      // What else would be the first argument ..?
      const url = commandLine.pop() || "";

      if (/^bmm:\/\//.test(url)) {
        navigateToUri(window, removeUrlOrigin(url));
      } else {
        window.loadURL(url);
      }
    });

    return window.loadURL(`${PRODUCTION_APP_PROTOCOL}://bmm.brunstad.org`);
  })
  .catch((error) => {
    // eslint-disable-next-line promise/catch-or-return
    import("log-symbols").then((t) => console.error(t.default.error, error));
  });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
