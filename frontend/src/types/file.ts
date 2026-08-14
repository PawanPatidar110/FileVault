export type FileVisibility = "PRIVATE" | "PUBLIC";

export interface FileItem {
    id:string;
    originalName:string;
    mimeType:string;
    size:string;
    visibility:FileVisibility;
    shareToken:string | null;
    isStarred:boolean;
    createdAt:string;
    updatedAt:string;
}