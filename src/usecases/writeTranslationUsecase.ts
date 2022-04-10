import Mod, { Entry, File, isLocalisation } from "../domains/mod";
import RemoteApi from "../remoteApi";
import Dictionary from "../utils/dictionary";
import { transformLocalisationYmlStyle } from "../utils/texts";
import Result, { ng, ok } from "../utils/result";

export default class WriteTranslationUsecase {
  constructor(private remoteApi: RemoteApi) {}

  async execute(
    mod: Mod,
    edit: Dictionary
  ): Promise<Result<undefined, string>> {
    const pathResponse = await this.remoteApi.selectDir();
    if (pathResponse.isCancelled) return ng("キャンセルされました");
    const path = pathResponse.value;

    const newFilename = `${mod.filename}_translated`;
    const paths = [path, newFilename];

    await this.remoteApi.mkDir(paths);

    const loop = async (entry: Entry, paths: string[]): Promise<void> => {
      const newPaths = [...paths, entry.name];
      if (entry.isDir) {
        if (entry.children.length === 0) return;

        await this.remoteApi.mkDir(newPaths);
        for (const child of entry.children) {
          await loop(child, newPaths);
        }
      } else {
        const body = this.buildYmlBody(entry, edit);
        await this.remoteApi.writeFile(newPaths, body);
      }
    };

    if (mod.localisation) await loop(mod.localisation, paths);
    if (mod.localisationSynced) await loop(mod.localisationSynced, paths);

    return ok(undefined);
  }

  private buildYmlBody(file: File, edit: Dictionary): string {
    return file.lines
      .map((line) => {
        if (isLocalisation(line)) {
          const { key, value: defaultValue, comment } = line;
          const value = transformLocalisationYmlStyle(
            edit.get(key) || defaultValue
          );
          return `${key} ${value} ${comment}`;
        } else {
          return line;
        }
      })
      .join("\r\n");
  }
}
