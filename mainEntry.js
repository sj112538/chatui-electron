"use strict";

// electron/main/index.ts
var { app, BrowserWindow } = require("electron");
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
  mainWindow.loadFile("dist/index.html");
  mainWindow.setMenu(null);
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
app.on("window-all-closed", function() {
  if (process.platform !== "darwin")
    app.quit();
});
