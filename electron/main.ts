import { app, BrowserWindow } from "electron"
app.whenReady().then(() => {
  new BrowserWindow().loadURL(
    "http://localhost:9001"
    /*process.env.VITE_DEV_SERVER_URL*/
  )
})