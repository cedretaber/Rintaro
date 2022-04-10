import { Entry as DirEntry } from "../../electron/interfaces/files";
import Mod, { Entry, dir, file } from "../domains/mod";
import RemoteApi from "../remoteApi";
import {
  LOCALISATION_DIRNAME,
  LOCALISATION_SYNCED_DIRNAME,
} from "../constants";
import ReadLocalisationFileService from "./readLocalisationFileService";
import ResolveModNameService from "./resolveModNameService";
import Result, { ng, ok, map as resultMap } from "../utils/results";

export default class ReadModUsecase {
  private readLocalisationFileService: ReadLocalisationFileService;
  private resolveModNameService: ResolveModNameService;

  constructor(private remoteApi: RemoteApi) {
    this.readLocalisationFileService = new ReadLocalisationFileService(
      remoteApi
    );
    this.resolveModNameService = new ResolveModNameService(remoteApi);
  }

  async execute(): Promise<Result<Mod, string>> {
    const dir = await this.remoteApi.readDirAll();
    if (dir.isCancelled) {
      return ng("キャンセルされました");
    } else {
      return this.buildMod(dir.value);
    }
  }

  private async buildMod(root: DirEntry): Promise<Result<Mod, string>> {
    const modNameResponse = await this.resolveModNameService.execute(root);
    if (modNameResponse.isNg) return modNameResponse;
    const modName = modNameResponse.value;

    const { name, children } = root;
    const localisationResponse = await this.buildLocalisation(
      children?.find(
        (entry) => entry.isDirectory && entry.name === LOCALISATION_DIRNAME
      )
    );
    const localisation = localisationResponse.isOk
      ? localisationResponse.value
      : undefined;

    const localisationSyncedResponse = await this.buildLocalisation(
      children?.find(
        (entry) =>
          entry.isDirectory && entry.name === LOCALISATION_SYNCED_DIRNAME
      )
    );
    const localisationSynced = localisationSyncedResponse.isOk
      ? localisationSyncedResponse.value
      : undefined;

    return ok({
      name: modName,
      filename: name,
      localisation,
      localisationSynced,
    });
  }

  private async buildLocalisation(
    root?: DirEntry
  ): Promise<Result<Entry, string>> {
    if (root === undefined) return ng("ディレクトリが正しくありません");

    if (root.isDirectory) {
      const resultChildren = root.children
        ? await Promise.all(
            root.children.map((child) => this.buildLocalisation(child))
          )
        : [];
      const children: Entry[] = [];
      for (const child of resultChildren)
        if (child.isOk) children.push(child.value);
      if (children === [])
        return ng("対象となるファイルがディレクトリ内に存在しません");
      return ok(dir(root.name, children));
    } else {
      const body = await this.readLocalisationFileService.execute(root);
      return resultMap((body) => file(root.name, body), body);
    }
  }
}
