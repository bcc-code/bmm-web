import { app, protocol, dialog, BrowserWindow } from "electron";
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
          relativePath !== "/" ? relativePath : "index.html"
        );

        // eslint-disable-next-line n/no-callback-literal, promise/no-callback-in-promise
        callback({ path: absolutePath });
      }
    );

    new BrowserWindow().loadURL(
      process.env.VITE_DEV_SERVER_URL ||
        `${PRODUCTION_APP_PROTOCOL}://bmm.brunstad.org`
    );
  })
  .catch((error) => {
    dialog.showErrorBox("Error:", error);
  });
