import Mod, { localisationsAsArray } from "../domains/mod";
import Translation from "../domains/translation";
import Dictionary, { empty as emptyDictionary } from "../utils/dictionary";

export default class PatchTranslationModUsecase {
  execute(mod: Mod, translation: Translation): Dictionary {
    const keys: string[] = [];
    if (mod.localisation) {
      for (const loc of localisationsAsArray(mod.localisation))
        keys.push(loc.key);
    }
    if (mod.localisationSynced) {
      for (const loc of localisationsAsArray(mod.localisationSynced))
        keys.push(loc.key);
    }

    const map = emptyDictionary();
    for (const key of keys) {
      const value = translation.map.get(key);
      if (value) {
        map.set(key, value);
      }
    }

    return map;
  }
}
