import fs from "node:fs/promises";
import path from "node:path";
import ImageKit from "@imagekit/nodejs";

import type {
    StorageResult,
    StorageService,
} from "./storage.service.js";

const imageKit = new ImageKit({
    privateKey:
        process.env.IMAGEKIT_PRIVATE_KEY!,
});

export class ImageKitStorage
    implements StorageService
{
    async save(
        file: Express.Multer.File,
        storageKey: string
    ): Promise<StorageResult> {
        const fileBuffer =
            await fs.readFile(file.path);

        const folder =
            `/filehub/${path.posix.dirname(
                storageKey
            )}`;

        const uploaded =
            await imageKit.files.upload({
                file: fileBuffer.toString(
                    "base64"
                ),

                fileName:
                    file.originalname,

                folder,

                useUniqueFileName: false,
            });

        return {
            storageKey,
            storageFileId:
                uploaded.fileId,
        };
    }

    async getFile(
        storageKey: string,
        storageFileId?: string
    ): Promise<Buffer> {

        if (!storageFileId) {
            throw new Error(
                "ImageKit file ID is missing"
            );
        }

        const file =
            await imageKit.files.get(
                storageFileId
            );

        if (!file.url) {
            throw new Error(
                "ImageKit file URL not found"
            );
        }

        const response =
            await fetch(file.url);

        if (!response.ok) {
            throw new Error(
                `Failed to download file from ImageKit: ${response.status}`
            );
        }

        const arrayBuffer =
            await response.arrayBuffer();

        return Buffer.from(
            arrayBuffer
        );
    }

    async delete(
        storageKey: string,
        storageFileId?: string
    ): Promise<void> {
        throw new Error(
            "delete is not implemented yet"
        );
    }
}