import { Entry } from "../../electron/interfaces/files";
import Translation from "../domains/translation";
import { isLocalisation } from "../domains/mod";
import RemoteApi from "../remoteApi";
import {
  LOCALISATION_DIRNAME,
  LOCALISATION_SYNCED_DIRNAME,
} from "../constants";
import ReadLocalisationFileService from "./readLocalisationFileService";
import ResolveModNameService from "./resolveModNameService";
import Dictionary, { empty as emptyDictionary } from "../utils/dictionary";
import Result, { ng, ok } from "../utils/result";

export default class ReadTranslationUsecase {
  private readLocalisationFileService: ReadLocalisationFileService;
  private resolveModNameService: ResolveModNameService;

  constructor(private remoteApi: RemoteApi) {
    this.readLocalisationFileService = new ReadLocalisationFileService(
      remoteApi
    );
    this.resolveModNameService = new ResolveModNameService(remoteApi);
  }

  async execute(): Promise<Result<Translation, string>> {
    const dir = await this.remoteApi.readDirAll();
    if (dir.isCancelled) return ng("キャンセルされました");
    return this.buildLocalisation(dir.value);
  }

  private async buildLocalisation(
    root: Entry
  ): Promise<Result<Translation, string>> {
    const modNameResponse = await this.resolveModNameService.execute(root);
    if (modNameResponse.isNg) return modNameResponse;
    const modName = modNameResponse.value;

    const { name, children } = root;
    const map = emptyDictionary();
    const map2 = await this.buildMap(
      map,
      children?.find(
        (entry) => entry.isDirectory && entry.name === LOCALISATION_DIRNAME
      )
    );
    const map3 = await this.buildMap(
      map2,
      children?.find(
        (entry) =>
          entry.isDirectory && entry.name === LOCALISATION_SYNCED_DIRNAME
      )
    );

    return ok({ name: modName, filename: name, map: map3 });
  }

  private async buildMap(map: Dictionary, entry?: Entry): Promise<Dictionary> {
    if (entry === undefined) return map;

    if (entry.children) {
      return this.buildMapFromChildren(map, entry.children);
    } else {
      const lines = await this.readLocalisationFileService.execute(entry);
      return (lines.isOk ? lines.value : []).reduce<Dictionary>((map, line) => {
        if (isLocalisation(line)) {
          const { key, value } = line;
          return map.set(key, value);
        } else {
          return map;
        }
      }, map);
    }
  }

  private async buildMapFromChildren(
    map: Dictionary,
    entries: readonly Entry[]
  ): Promise<Dictionary> {
    if (entries.length === 0) return map;

    const [head, ...rest] = entries;
    const map2 = await this.buildMap(map, head);
    return this.buildMapFromChildren(map2, rest);
  }
}
