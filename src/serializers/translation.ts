import Translation from "../domains/translation";
import { fromArray, toArray } from "../utils/dictionary";

export type SerializableTranslation = {
  name: string;
  filename: string;
  map: [string, string][];
};

export const asSerializable = ({
  name,
  filename,
  map,
}: Translation): SerializableTranslation => ({
  name,
  filename,
  map: toArray(map),
});

export const fromSerializable = ({
  name,
  filename,
  map,
}: SerializableTranslation): Translation | undefined => ({
  name,
  filename,
  map: fromArray(map),
});
