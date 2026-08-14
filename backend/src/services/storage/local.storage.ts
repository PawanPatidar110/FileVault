import path from "node:path";
import fs from "node:fs/promises";
import { StorageResult, StorageService } from "./storage.service.js";

const STORAGE_ROOT = path.resolve("storage");

export class LocalStorage implements StorageService {
    async save(
    file: Express.Multer.File,
    storageKey: string
): Promise<StorageResult> {
    const destination = path.join(
        STORAGE_ROOT,
        storageKey
    );

    await fs.mkdir(
        path.dirname(destination),
        {
            recursive: true,
        }
    );

    await fs.writeFile(
        destination,
        file.buffer
    );

    return {
        storageKey,
    };
}
    async delete(storageKey:string,_storageFileId?:string):Promise<void>{
        const filePath = path.join(STORAGE_ROOT,storageKey);

        try {
            await fs.unlink(filePath);
        } catch (error: unknown) {
            if(error instanceof Error && "code" in error && error.code === "ENOENT"){
                return;
            }
            throw error;
            
        }
    }

    async getFile(storageKey:string,_storageFileId?:string):Promise<Buffer>{
        const filePath = path.join(
            STORAGE_ROOT,
            storageKey
        );
        return fs.readFile(filePath);
    }
}