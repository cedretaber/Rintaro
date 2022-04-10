export type Localisation = { key: string; value: string; comment: string };
export type Line = string | Localisation;
export const isLocalisation = (line: Line): line is Localisation =>
  typeof line !== "string";

export type File = {
  name: string;
  lines: readonly Line[];
  isFile: true;
  isDir: false;
};
export const file = (name: string, lines: Line[]): File => ({
  name,
  lines,
  isFile: true,
  isDir: false,
});

export type Dir = {
  name: string;
  children: readonly Entry[];
  isFile: false;
  isDir: true;
};
export const dir = (name: string, children: Entry[]): Dir => ({
  name,
  children,
  isFile: false,
  isDir: true,
});

export type Entry = File | Dir;

export type Mod = {
  name: string;
  filename: string;
  localisation?: Entry;
  localisationSynced?: Entry;
};

export const localisationsAsArray = (entry: Entry): Localisation[] => {
  const localisations: Localisation[] = [];
  const go = (entry: Entry) => {
    if (entry.isDir) {
      for (const child of entry.children) go(child);
    } else {
      for (const line of entry.lines) {
        if (isLocalisation(line)) localisations.push(line);
      }
    }
  };
  go(entry);

  return localisations;
};

export default Mod;
