import { Entry } from "../../electron/interfaces/files";
import { Line } from "../domains/mod";
import RemoteApi from "../remoteApi";
import {
  LOCALISATION_FILE_EXT,
  UTF8BOM,
  ALLOWED_LOCALISATION_LANG,
} from "../constants";
import { parseLine } from "../utils/texts";
import Result, { ng, ok } from "../utils/results";

export default class ReadLocalisationFileService {
  constructor(private remoteApi: RemoteApi) {}

  async execute(entry: Entry): Promise<Result<Line[], string>> {
    if (!entry.name.endsWith(LOCALISATION_FILE_EXT))
      return ng("翻訳ファイルではありません");

    const response = await this.remoteApi.openFile(entry.fullPath);
    if (response.isCancelled) return ng("キャンセルされました");
    const body = response.value;
    if (body.charCodeAt(0) !== UTF8BOM) return ng("先頭に BOM が存在しません");

    const localisation_type = body.slice(1, 10);
    if (!ALLOWED_LOCALISATION_LANG.some((loc) => loc === localisation_type))
      return ng("英語用の翻訳ファイルにのみ対応しています");

    return ok(body.split("\n").map(parseLine));
  }
}
