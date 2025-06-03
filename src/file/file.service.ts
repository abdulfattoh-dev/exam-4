import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, writeFile } from "fs";
import { extname, join, resolve } from "path";
import config from "src/config";
import { catchError } from "src/utils/catch-error";
import { v4 } from "uuid";

@Injectable()
export class FileService {
    private  readonly baseurl = config.BASE_URL;
    
    async createFile(file: Express.Multer.File) {
        try {
            const ext = extname(file.originalname)
            const fileName = `${file.originalname.split('.')[0]}_${v4()}${ext}`;
            const filePath = resolve(__dirname, '..', '..', '..', 'uploads')
            if(!existsSync(filePath)){
                mkdirSync(filePath, {recursive: true})
            }

            await new Promise<void>((res, rej) => {
                writeFile(join(filePath, fileName), file.buffer, (err) => {
                    if(err) rej(err);
                    res()
                })
            })
            return `${this.baseurl}/${fileName}`;
        } catch (error) {
            return catchError(error)
        }
    } 
}