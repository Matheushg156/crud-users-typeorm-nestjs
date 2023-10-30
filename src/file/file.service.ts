import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises";

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, path: string) {

    return await writeFile(path, file.buffer);

  }
}