var import_electron = require("electron");
import_electron.app.whenReady().then(() => {
  new import_electron.BrowserWindow().loadURL(
    "http://localhost:9001"
    /*process.env.VITE_DEV_SERVER_URL*/
  );
});
