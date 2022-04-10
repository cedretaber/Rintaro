type Dictionary = Map<string, string>;

export const toArray = (dict: Dictionary): [string, string][] =>
  Array.from(dict.entries());

export const fromArray = (arr: [string, string][]): Dictionary =>
  new Map<string, string>(arr);

export const empty = (): Dictionary => new Map<string, string>();

export const copy = (dict: Dictionary): Dictionary =>
  new Map<string, string>(dict);

export const updated = (
  key: string,
  value: string,
  dict: Dictionary
): Dictionary => {
  const newDict = copy(dict);
  return newDict.set(key, value);
};

export const deleted = (key: string, dict: Dictionary): Dictionary => {
  const newDict = copy(dict);
  newDict.delete(key);
  return newDict;
};

export default Dictionary;
