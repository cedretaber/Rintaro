import * as path from "path";
import { Entry } from "./interfaces/files";

import FileRepository from "./repositories/fileRepository";

export default class FileUtils {
  constructor(private fileRepository: FileRepository) {}

  async readTextFile(path: string): Promise<string> {
    return this.fileRepository.readFile(path);
  }

  async readFileNamesAll(rootPath: string): Promise<Entry> {
    const entries = await this.fileRepository.readDir(rootPath);
    const children = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(rootPath, entry.name);
        if (entry.isDirectory) {
          return this.readFileNamesAll(fullPath);
        } else {
          return {
            name: entry.name,
            dirname: rootPath,
            fullPath,
            isDirectory: false,
          };
        }
      })
    );
    return {
      name: path.basename(rootPath),
      dirname: path.dirname(rootPath),
      fullPath: rootPath,
      isDirectory: true,
      children,
    };
  }

  async mkDir(path: string): Promise<undefined> {
    await this.fileRepository.mkDir(path);
    return;
  }

  async writeFile(path: string, data: string): Promise<undefined> {
    await this.fileRepository.writeFile(path, data);
    return;
  }
}
