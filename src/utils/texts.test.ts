import { parseLine } from "./texts";

describe("parseLine", () => {
  test("Parse localisation line post-commented", () => {
    const key = "key:0";
    const value = "value";
    const comment = "# comment";
    const line = `${key} "${value}" ${comment}`;

    const expected = { key, value, comment };
    const actual = parseLine(line);

    expect(actual).toEqual(expected);
  });
});
