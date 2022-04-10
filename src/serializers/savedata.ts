import Mod from "../domains/mod";
import Dictionary, { fromArray, toArray } from "../utils/dictionary";
import {
  SerializableMod,
  asSerializable as serializeMod,
  fromSerializable as deserializeMod,
} from "./mod";

export type SaveData = {
  mod: SerializableMod;
  edit: [string, string][];
};

export const createSaveDataAsString = (mod: Mod, edit: Dictionary): string => {
  const saveData: SaveData = {
    mod: serializeMod(mod),
    edit: toArray(edit),
  };
  return JSON.stringify(saveData);
};

export const loadSaveDataFromString = (
  saveDataStr: string
): [Mod, Dictionary] | undefined => {
  const { mod, edit }: SaveData = JSON.parse(saveDataStr);

  const savedMod = deserializeMod(mod);
  if (savedMod === undefined) return;

  const savedEdit = fromArray(edit);
  if (savedEdit === undefined) return;

  return [savedMod, savedEdit];
};
