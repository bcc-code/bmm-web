import { app, BrowserWindow } from "electron";

app
  .whenReady()
  .then(() => {
    new BrowserWindow().loadURL(
      process.env.VITE_DEV_SERVER_URL ||
        // eslint-disable-next-line n/no-path-concat
        `file://${__dirname}/../.output/public/index.html`
    );
  })
  .catch((error) => {
    console.error(error);
  });
