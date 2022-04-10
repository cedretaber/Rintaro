import * as Path from "path";
import { when } from "jest-when";

import FileUtils from "./fileUtils";
import FileRepository from "./repositories/fileRepository";

describe("readTextFile", () => {
  test("Read file", async () => {
    const readFile = jest.fn();
    const fileRepository = {
      readFile,
    } as unknown as FileRepository;

    const path = "path/to/file";
    const fileBody = "There will be nice text!";
    readFile.mockReturnValueOnce(fileBody);

    const actual = await new FileUtils(fileRepository).readTextFile(path);
    expect(actual).toEqual(fileBody);
    expect(readFile).toBeCalledTimes(1);
    expect(readFile).toHaveBeenLastCalledWith(path);
  });
});

describe("readFileNamesAll", () => {
  test("Resolve flat directory", async () => {
    const readDir = jest.fn();
    const fileRepository = {
      readDir,
    } as unknown as FileRepository;

    const path = "path/to/dir";
    const files = [
      { name: "file1", isDirectory: false },
      { name: "file2", isDirectory: false },
      { name: "file3", isDirectory: false },
    ];
    readDir.mockReturnValueOnce(files);

    const expected = {
      name: Path.basename(path),
      dirname: Path.dirname(path),
      fullPath: path,
      isDirectory: true,
      children: files.map(({ name }) => ({
        name,
        dirname: path,
        fullPath: Path.join(path, name),
        isDirectory: false,
      })),
    };

    const actual = await new FileUtils(fileRepository).readFileNamesAll(path);
    expect(actual).toEqual(expected);
    expect(readDir).toBeCalledTimes(1);
    expect(readDir).toHaveBeenLastCalledWith(path);
  });

  test("Resolve nested directory", async () => {
    const readDir = jest.fn();
    const fileRepository = {
      readDir,
    } as unknown as FileRepository;

    const parent = "parent";
    const dir1 = "dir1";
    const dir2 = "dir2";
    const dir3 = "dir3";
    const path = Path.join("path", "to", parent);
    const filesFromParent = [
      { name: "file1", isDirectory: false },
      { name: "file2", isDirectory: false },
      { name: dir1, isDirectory: true },
      { name: dir2, isDirectory: true },
    ];
    const filesFromDir1 = [
      { name: "file3", isDirectory: false },
      { name: "file4", isDirectory: false },
    ];
    const filesFromDir2 = [
      { name: "file5", isDirectory: false },
      { name: dir3, isDirectory: true },
    ];
    const filesFromDir3 = [
      { name: "file6", isDirectory: false },
      { name: "file7", isDirectory: false },
    ];
    when(readDir).calledWith(path).mockReturnValue(filesFromParent);
    when(readDir)
      .calledWith(Path.join(path, dir1))
      .mockReturnValue(filesFromDir1);
    when(readDir)
      .calledWith(Path.join(path, dir2))
      .mockReturnValue(filesFromDir2);
    when(readDir)
      .calledWith(Path.join(path, dir2, dir3))
      .mockReturnValue(filesFromDir3);

    const expected = {
      name: parent,
      dirname: Path.dirname(path),
      fullPath: path,
      isDirectory: true,
      children: [
        {
          name: "file1",
          dirname: path,
          fullPath: Path.join(path, "file1"),
          isDirectory: false,
        },
        {
          name: "file2",
          dirname: path,
          fullPath: Path.join(path, "file2"),
          isDirectory: false,
        },
        {
          name: dir1,
          dirname: path,
          fullPath: Path.join(path, dir1),
          isDirectory: true,
          children: [
            {
              name: "file3",
              dirname: Path.join(path, dir1),
              fullPath: Path.join(path, dir1, "file3"),
              isDirectory: false,
            },
            {
              name: "file4",
              dirname: Path.join(path, dir1),
              fullPath: Path.join(path, dir1, "file4"),
              isDirectory: false,
            },
          ],
        },
        {
          name: dir2,
          dirname: path,
          fullPath: Path.join(path, dir2),
          isDirectory: true,
          children: [
            {
              name: "file5",
              dirname: Path.join(path, dir2),
              fullPath: Path.join(path, dir2, "file5"),
              isDirectory: false,
            },
            {
              name: dir3,
              dirname: Path.join(path, dir2),
              fullPath: Path.join(path, dir2, dir3),
              isDirectory: true,
              children: [
                {
                  name: "file6",
                  dirname: Path.join(path, dir2, dir3),
                  fullPath: Path.join(path, dir2, dir3, "file6"),
                  isDirectory: false,
                },
                {
                  name: "file7",
                  dirname: Path.join(path, dir2, dir3),
                  fullPath: Path.join(path, dir2, dir3, "file7"),
                  isDirectory: false,
                },
              ],
            },
          ],
        },
      ],
    };

    const actual = await new FileUtils(fileRepository).readFileNamesAll(path);
    expect(actual).toEqual(expected);
    expect(readDir).toBeCalledTimes(4);
  });
});
