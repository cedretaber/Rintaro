import Dictionary from "../utils/dictionary";

type Translation = {
  name: string;
  filename: string;
  map: Dictionary;
};

export const eq = (left: Translation, right: Translation): boolean =>
  left.name === right.name && left.filename === right.filename;

export default Translation;
