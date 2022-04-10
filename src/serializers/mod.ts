import Mod from "../domains/mod";

export type SerializableMod = Mod;

export const asSerializable = (mod: Mod): SerializableMod => mod;

export const fromSerializable = (mod: SerializableMod): Mod | undefined => mod;
