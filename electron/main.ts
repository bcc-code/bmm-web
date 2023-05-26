import { app, protocol, shell, dialog, BrowserWindow } from "electron";
import * as path from "path";

const PRODUCTION_APP_PROTOCOL = "bmm";
const PRODUCTION_APP_PATH = path.join(__dirname, "..", ".output", "public");

protocol.registerSchemesAsPrivileged([
  {
    scheme: PRODUCTION_APP_PROTOCOL,
    privileges: { secure: true, standard: true },
  },
]);

app
  .whenReady()
  .then(() => {
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

    const window = new BrowserWindow();
    // Forward each URL, which is not on the custom protocol, to the browser. Introduced for login-process.
    window.webContents.on("will-navigate", (e, url) => {
      if (!url.startsWith(`${PRODUCTION_APP_PROTOCOL}://`)) {
        // TODO: Maybe its good to inform the user about what will happen here ...
        // dialog.showMessageBox(window)
        e.preventDefault();
        shell.openExternal(url).catch((error) => {
          dialog.showErrorBox(url, `${error}`);
        });
      }
    });
    return window.loadURL(
      process.env.VITE_DEV_SERVER_URL ||
        `${PRODUCTION_APP_PROTOCOL}://bmm.brunstad.org`
    );
  })
  .catch((error) => {
    // eslint-disable-next-line promise/catch-or-return
    import("log-symbols").then((t) => console.error(t.default.error, error));
  });
