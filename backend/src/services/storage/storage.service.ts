export interface StorageResult {
    storageKey: string;
    storageFileId?: string;
}

export interface StorageService {
    save(
        file: Express.Multer.File,
        storageKey: string
    ): Promise<StorageResult>;

    getFile(
        storageKey: string,
        storageFileId?:string,
    ): Promise<Buffer>;

    delete(
        storageKey: string,
        storageFileId?:string
    ): Promise<void>;
}