import type { FileItem, FileVisibility } from "../types/file";
import api from "./axios";

export const getFiles = async (): Promise<FileItem[]> => {
    const response = await api.get("/api/files");

    return response.data.data;
};

export const getFileById = async (
    fileId: string
): Promise<FileItem> => {
    const response = await api.get(
        `/api/files/${fileId}`
    );

    return response.data.data;
};

export const uploadFile = async (
    file: File,
    visibility: FileVisibility
) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("visibility", visibility);

    const response = await api.post(
        "/api/files",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const deleteFile = async (
    fileId: string
) => {
    const response = await api.delete(
        `/api/files/${fileId}`
    );

    return response.data;
};

export const updateFileVisibility = async (
    fileId: string,
    visibility: FileVisibility
) => {
    const response = await api.patch(
        `/api/files/${fileId}/visibility`,
        {
            visibility,
        }
    );

    return response.data;
};

export const downloadFile = async (
    fileId: string
): Promise<Blob> => {
    const response = await api.get(
        `/api/files/${fileId}/download`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};

export const getSharedFile = async (
    shareToken: string
) => {
    const response = await api.get(
        `/api/files/share/${shareToken}`
    );

    return response.data.data;
};

/**
 * Download a publicly shared file.
 *
 * This endpoint does not require authentication.
 */
export const downloadSharedFile = async (
    shareToken: string
): Promise<Blob> => {
    const response = await api.get(
        `/api/files/share/${shareToken}/download`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};

export const getFilePreview = async (
    fileId: string
): Promise<Blob> => {
    const response = await api.get(
        `/api/files/${fileId}/preview`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};

export const updateFileStarred = async (
    fileId: string,
    isStarred: boolean
) => {
    const response = await api.patch(
        `/api/files/${fileId}/starred`,
        {
            isStarred,
        }
    );

    return response.data.data;
};