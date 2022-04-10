import * as fs from "fs/promises";

export type Dirent = {
  name: string;
  isDirectory: boolean;
};

export default interface FileRepository {
  readFile: (path: string) => Promise<string>;
  readDir: (path: string) => Promise<Dirent[]>;
  mkDir: (path: string) => Promise<void>;
  writeFile: (path: string, data: string) => Promise<void>;
}

export const fileRepository: FileRepository = {
  readFile: async (path: string) =>
    fs.readFile(path).then((buf) => buf.toString()),

  readDir: (path: string) =>
    fs
      .readdir(path, { withFileTypes: true })
      .then((dirs) =>
        dirs.map((dir) => ({ name: dir.name, isDirectory: dir.isDirectory() }))
      ),

  mkDir: (path: string) => fs.mkdir(path),

  writeFile: (path: string, data: string) => fs.writeFile(path, data),
};
