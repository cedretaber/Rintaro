import { ipcRenderer, contextBridge } from "electron";
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

type R = ReturnType<typeof RemoteFunctions>;
type ResponseType<K extends keyof R> = ReturnType<R[K]>;

export const remoteApi = {
  [OPEN_FILE]: async (path?: string): ResponseType<typeof OPEN_FILE> =>
    ipcRenderer.invoke(OPEN_FILE, path),
  [SELECT_DIR]: async (): ResponseType<typeof SELECT_DIR> =>
    ipcRenderer.invoke(SELECT_DIR),
  [SAVE_FILE]: async (): ResponseType<typeof SAVE_FILE> =>
    ipcRenderer.invoke(SAVE_FILE),
  [READ_DIR_ALL]: async (): ResponseType<typeof READ_DIR_ALL> =>
    ipcRenderer.invoke(READ_DIR_ALL),
  [MK_DIR]: async (path: string[]): ResponseType<typeof MK_DIR> =>
    ipcRenderer.invoke(MK_DIR, path),
  [WRITE_FILE]: async (
    path: string[],
    data: string
  ): ResponseType<typeof WRITE_FILE> =>
    ipcRenderer.invoke(WRITE_FILE, path, data),
  [LOAD_SAVE_FILE]: async (): ResponseType<typeof LOAD_SAVE_FILE> =>
    ipcRenderer.invoke(LOAD_SAVE_FILE),
};

contextBridge.exposeInMainWorld("remoteApi", remoteApi);
