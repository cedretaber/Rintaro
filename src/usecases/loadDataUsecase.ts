import Mod from "../domains/mod";
import RemoteApi from "../remoteApi";
import { loadSaveDataFromString } from "../serializers/savedata";
import Dictionary from "../utils/dictionary";
import Result, { ng, ok } from "../utils/results";

export default class LoadDataUsecase {
  constructor(private remoteApi: RemoteApi) {}

  async execute(): Promise<Result<[Mod, Dictionary], string>> {
    const saveDataStr = await this.remoteApi.loadSaveFile();
    if (saveDataStr.isCancelled) return ng("キャンセルされました");

    const saveData = loadSaveDataFromString(saveDataStr.value);
    if (saveData === undefined)
      return ng("セーブデータの読み取りに失敗しました");

    return ok(saveData);
  }
}
