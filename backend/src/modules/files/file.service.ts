import { prisma } from "../../lib/prisma.js"
import { storageService } from "../../services/storage/index.js";


export const getUserFiles = async (userId: string) => {
    const files = await prisma.file.findMany({
        where:{
            userId
        },
        orderBy:{
            createdAt:"desc"
        },
        select:{
            id:true,
            originalName:true,
            mimeType:true,
            size:true,
            visibility:true,
            shareToken:true,
            isStarred:true,
            createdAt:true,
            updatedAt:true
        }
    });
    return files.map((file) => ({
        ...file,
        size:file.size.toString(),
    }));
};


export const createFile = async ({
    userId,file,visibility
}: {
    userId:string;
    file:Express.Multer.File;
    visibility: "PRIVATE" | "PUBLIC";
}) => {
    const fileId = crypto.randomUUID();

    const storageKey = `users/${userId}/files/${fileId}/${file.originalname}`;

   const storageResult = await storageService.save(file,storageKey);

    const shareToken = visibility === "PUBLIC" ? crypto.randomUUID() : null;

    const createdFile = await prisma.file.create({
        data:{
            id:fileId,
            userId,
            originalName:file.originalname,
            storageKey,
            storageProvider:"IMAGEKIT",
            storageFileId:storageResult.storageFileId,
            mimeType:file.mimetype,
            size:BigInt(file.size),
            visibility,
            shareToken
        }
    });
    console.log("Created file:", createdFile);
console.log("Created file size:", createdFile.size);

    return {
        ...createdFile,
        size:createdFile.size.toString()
    };
};


export const getFileById = async (
    fileId:string,
    userId:string
) => {
    const file = await prisma.file.findFirst({
        where:{
            id:fileId,
            userId:userId
        }
    });

    if(!file){
        throw new Error("file not found");
    }

    return {
        ...file,
        size:file.size.toString()
    };
};



export const deleteFile = async (
    fileId:string,
    userId:string
) => {
    const file = await prisma.file.findFirst({
        where:{
            id:fileId,
            userId
        }
    });

    if(!file){
        throw new Error("File not found");
    }

    //Delete physical file
    await storageService.delete(file.storageKey);

    await prisma.file.delete({
        where:{
            id:file.id
        }
    });
};

export const updateFileVisibility = async (
    fileId:string,
    userId:string,
    visibility:"PRIVATE" | "PUBLIC"
) => {
    const file = await prisma.file.findFirst({
        where:{
            id:fileId,
            userId
        }
    });

    if(!file){
        throw new Error("File not Found");
    }

    const shareToken = visibility === "PUBLIC" ? file.shareToken ?? crypto.randomUUID() : null;

    const updatedFile = await prisma.file.update({
        where:{
            id:file.id
        },
        data:{
            visibility,
            shareToken
        }
    });

    return {
        ...updatedFile,
        size:updatedFile.size.toString()
    };
};

export const getPublicFileByToken = async (
    shareToken:string
) => {
    const file = await prisma.file.findFirst({
        where:{
            shareToken,
            visibility:"PUBLIC"
        }
    });

    if(!file){
        throw new Error("File not Found");
    }

    return {
        ...file,
        size:file.size.toString()
    };
};


export const getFileForDownload = async (
    fileId:string,
    userId:string
) => {
    const file = await prisma.file.findFirst({
        where:{
            id:fileId,
            userId
        }
    });

    if(!file){
        throw new Error("File not found");
    }

    return file;
}


export const updateFileStarred = async (
    fileId: string,
    userId: string,
    isStarred: boolean
) => {
    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            userId,
        },
    });

    if (!file) {
        throw new Error("File not found");
    }

    const updatedFile = await prisma.file.update({
        where: {
            id: file.id,
        },
        data: {
            isStarred,
        },
    });

    return {
        ...updatedFile,
        size: updatedFile.size.toString(),
    };
};