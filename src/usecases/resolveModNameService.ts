import { Entry } from "../../electron/interfaces/files";
import {
  DESCRIPTOR_FILENAME,
  DESCRIPTOR_MODNAME_KEY,
  UTF8BOM,
} from "../constants";
import RemoteApi from "../remoteApi";
import Result, { ng, ok } from "../utils/results";

export default class ResolveModNameService {
  constructor(private remoteApi: RemoteApi) {}

  async execute(entry: Entry): Promise<Result<string, string>> {
    const children = entry.children;
    if (children === undefined) return ng("ディレクトリではありません");

    for (const child of children)
      if (child.name === DESCRIPTOR_FILENAME) {
        const response = await this.remoteApi.openFile(child.fullPath);
        if (response.isCancelled) return ng("キャンセルされました");
        const descriptor = response.value;
        if (descriptor) {
          const lines = (
            descriptor.codePointAt(0) === UTF8BOM
              ? descriptor.slice(1)
              : descriptor
          ).split("\n");
          for (const line of lines) {
            if (line.trim().startsWith(DESCRIPTOR_MODNAME_KEY)) {
              const name = line.split("=")[1];
              return ok(name.slice(1, name.length - 2));
            }
          }
        }
      }
    return ng("descriptor.mod ファイルがありません");
  }
}
