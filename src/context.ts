import React from "react";
import Translation from "./domains/translation";
import Mod from "./domains/mod";
import Dictionary, { empty as emptyDictionary } from "./utils/dictionary";

export const StateContext = React.createContext<{
  mod: Mod | undefined;
  translations: Translation[];
  edit: Dictionary;
}>({
  mod: undefined,
  translations: [],
  edit: emptyDictionary(),
});
