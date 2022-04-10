import path = require("path");
import * as Electron from "electron";
import FileUtils from "./fileUtils";
import { cancelled, DialogResponse, Entry, success } from "./interfaces/files";
import {
  LOAD_SAVE_FILE,
  MK_DIR,
  OPEN_FILE,
  READ_DIR_ALL,
  SAVE_FILE,
  SELECT_DIR,
  WRITE_FILE,
} from "./interfaces/messages";

const RemoteFunctions = (
  mainWindow: Electron.BrowserWindow,
  fileUtils: FileUtils
) => {
  return {
    [OPEN_FILE]: async (
      _event: Electron.IpcMainInvokeEvent,
      path?: string
    ): Promise<DialogResponse<string>> => {
      if (path) {
        const value = await fileUtils.readTextFile(path);
        return success(value);
      }

      const result = await Electron.dialog.showOpenDialog(mainWindow, {
        properties: ["openFile"],
        title: "ファイルを選択",
        filters: [{ name: "テキスト", extensions: ["txt"] }],
      });

      if (result.canceled) return cancelled;

      const value = await fileUtils.readTextFile(result.filePaths[0]);
      return success(value);
    },

    [READ_DIR_ALL]: async (): Promise<DialogResponse<Entry>> => {
      const result = await Electron.dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
        title: "フォルダーを選択",
      });
      if (result.canceled) return cancelled;
      const value = await fileUtils.readFileNamesAll(result.filePaths[0]);
      return success(value);
    },

    [SELECT_DIR]: async (): Promise<DialogResponse<string>> => {
      const result = await Electron.dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
        title: "フォルダーを選択",
      });
      if (result.canceled) return cancelled;
      return success(result.filePaths[0]);
    },

    [MK_DIR]: async (
      _event: Electron.IpcMainInvokeEvent,
      paths: string[]
    ): Promise<undefined> => {
      return await fileUtils.mkDir(path.join(...paths));
    },

    [WRITE_FILE]: async (
      _event: Electron.IpcMainInvokeEvent,
      paths: string[],
      data: string
    ): Promise<undefined> => {
      return await fileUtils.writeFile(path.join(...paths), data);
    },

    [SAVE_FILE]: async (): Promise<DialogResponse<string>> => {
      const userDataPath = Electron.app.getPath("userData");
      const result = await Electron.dialog.showSaveDialog(mainWindow, {
        defaultPath: userDataPath,
        title: "保存場所を選択",
      });
      if (result.canceled) return cancelled;

      return success(result.filePath);
    },

    [LOAD_SAVE_FILE]: async (): Promise<DialogResponse<string>> => {
      const result = await Electron.dialog.showOpenDialog(mainWindow, {
        properties: ["openFile"],
        title: "ファイルを選択",
        filters: [{ name: "JSON", extensions: ["json"] }],
      });

      if (result.canceled) return cancelled;
      const value = await fileUtils.readTextFile(result.filePaths[0]);
      return success(value);
    },
  };
};

export default RemoteFunctions;
