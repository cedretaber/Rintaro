import Mod from "../domains/mod";
import RemoteApi from "../remoteApi";
import { createSaveDataAsString } from "../serializers/savedata";
import Dictionary from "../utils/dictionary";
import Result, { ng, ok } from "../utils/result";

export default class SaveDataUsecase {
  constructor(private remoteApi: RemoteApi) {}

  async execute(
    mod: Mod,
    edit: Dictionary
  ): Promise<Result<undefined, string>> {
    const filePath = await this.remoteApi.saveFile();
    if (filePath.isCancelled) return ng("キャンセルされました");

    const saveData = createSaveDataAsString(mod, edit);
    await this.remoteApi.writeFile([filePath.value], saveData);
    return ok(undefined);
  }
}
