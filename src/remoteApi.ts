import { remoteApi as preloadedRemoteApi } from "../electron/preload";

declare global {
  interface Window {
    remoteApi: typeof preloadedRemoteApi;
  }
}

export const remoteApi = {
  openFile: async (path?: string) => window.remoteApi.openFile(path),
  selectDir: async () => window.remoteApi.selectDir(),
  saveFile: async () => window.remoteApi.saveFile(),
  readDirAll: async () => window.remoteApi.readDirAll(),
  mkDir: async (path: string[]) => window.remoteApi.mkDir(path),
  writeFile: async (path: string[], data: string) =>
    window.remoteApi.writeFile(path, data),
  loadSaveFile: async () => window.remoteApi.loadSaveFile(),
};

type RemoteApi = typeof remoteApi;

export default RemoteApi;
