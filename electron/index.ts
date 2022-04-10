import * as path from "path";
import { URL, format as urlFormat } from "url";
import * as Electron from "electron";

import FileUtils from "./fileUtils";
import { fileRepository } from "./repositories/fileRepository";
import {
  LOAD_SAVE_FILE,
  MK_DIR,
  OPEN_FILE,
  READ_DIR_ALL,
  SAVE_FILE,
  SELECT_DIR,
  WRITE_FILE,
} from "./interfaces/messages";
import RemoteFunctions from "./remoteFunctions";

Electron.app.on("ready", async () => {
  console.log("Start App.");

  const mainWindow = new Electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const fileUtils = new FileUtils(fileRepository);
  const remoteFunctions = RemoteFunctions(mainWindow, fileUtils);
  const functionKeys = [
    OPEN_FILE,
    READ_DIR_ALL,
    SELECT_DIR,
    MK_DIR,
    WRITE_FILE,
    SAVE_FILE,
    LOAD_SAVE_FILE,
  ];
  for (const key of functionKeys)
    Electron.ipcMain.handle(key, remoteFunctions[key]);

  if (Electron.app.isPackaged) {
    console.log("Running in ProductMode...");
    mainWindow.loadURL(
      new URL(path.join(__dirname, "../index.html")).toString()
    );
  } else {
    console.log("Running in DevMode...");
    mainWindow.loadURL("http://localhost:3000/");
    mainWindow.webContents.openDevTools();
  }
});

Electron.app.on("window-all-closed", Electron.app.quit);
