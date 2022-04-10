import React from "react";
import Translation, { eq as eqTranslation } from "./domains/translation";
import Mod from "./domains/mod";
import Dictionary, {
  updated as updatedDictionary,
  deleted as deletedDictionary,
} from "./utils/dictionary";
import Alert, { AlertType } from "./domains/alert";

export default class Dispatcher {
  constructor(
    private setMod: React.Dispatch<React.SetStateAction<Mod | undefined>>,
    private setTranslations: React.Dispatch<
      React.SetStateAction<Translation[]>
    >,
    private setEdit: React.Dispatch<React.SetStateAction<Dictionary>>,
    private setProcessing: React.Dispatch<
      React.SetStateAction<string | undefined>
    >,
    private setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
  ) {}

  changeMod(mod: Mod): void {
    this.setMod(mod);
  }

  resetMod(): void {
    this.setMod(undefined);
  }

  addTranslation(translation: Translation): void {
    this.setTranslations((translations) => {
      if (translations.some((t) => eqTranslation(t, translation))) {
        return translations;
      } else {
        return [...translations, translation];
      }
    });
  }

  removeTranslation(translation: Translation): void {
    this.setTranslations((translations) => {
      const index = translations.findIndex((t) =>
        eqTranslation(t, translation)
      );
      if (index === -1) return translations;
      return [
        ...translations.slice(0, index),
        ...translations.slice(index + 1),
      ];
    });
  }

  changeEdit(edit: Dictionary): void {
    this.setEdit(edit);
  }

  patchEdit(key: string, value: string): void {
    this.setEdit((edit) => updatedDictionary(key, value, edit));
  }

  deleteFromEdit(key: string): void {
    this.setEdit((edit) => deletedDictionary(key, edit));
  }

  enableProcessing(text: string): void {
    this.setProcessing(text);
  }

  disableProcessing(): void {
    this.setProcessing(undefined);
  }

  addAlert(type: AlertType, body: string): void {
    this.setAlerts((alerts) => [...alerts, { type, body }]);
    setTimeout(() => {
      this.setAlerts((alerts) => alerts.slice(1));
    }, 5000);
  }
}
