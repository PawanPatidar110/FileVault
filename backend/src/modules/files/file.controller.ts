import { NextFunction, Request, Response } from "express";
import { createFile, getUserFiles , getFileById, deleteFile, updateFileVisibility, getPublicFileByToken, getFileForDownload , updateFileStarred } from "./file.service.js";
import { storageService } from "../../services/storage/index.js";

export const getFiles = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
        }

        const files = await getUserFiles(userId);

        return res.status(200).json({
            success:true,
            data:files
        });
    } catch (error) {
        next(error);
    }
}


export const uploadFile = async (req:Request,res:Response,next:NextFunction) => {
    try {
                console.log("REQ FILE:", req.file);
        console.log("REQ BODY:", req.body);

        
        const userId = req.user?.userId;
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
        }


        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"File is required"
            });
        }

        const visibility = req.body.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE";

        const file = await createFile({
            userId,
            file:req.file,
            visibility
        });

        return res.status(201).json({
            success:true,
            message:"File uploaded successfully",
            data:file
        });
    } catch (error) {
        next(error);
    }
};


export const getFile = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user?.userId;

    if(!userId){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }
    const fileId = req.params.id as string;
   
    const file = await getFileById(fileId, userId);
    
    return res.status(200).json({
        success:true,
        data:file
    });
    } catch (error) {
        next(error);
    }
}

export const removeFile = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
        }
        const fileId = req.params.id as string;

        await deleteFile(fileId,userId);

       return res.status(200).json({
        success:true,
        message:"File Delete Successfully"
       })
    } catch (error) {
        next(error);
    }
}


export const updateVisibility = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            return res.status(401).json({
                success:false,
                message:"Unauthorised"
            });
        }

        const fileId = req.params.id as string;

        const {visibility} =req.body;

        if(visibility !== "PRIVATE" && visibility !== "PUBLIC"){
            return res.status(400).json({
                success:false,
                message:"Visibility must be Private or public"
            });
        }

        const file = await updateFileVisibility(fileId,userId,visibility);

        return res.status(200).json({
            success:true,
            message:"File visibility updated succesfully",
            data:file
        });

    } catch (error) {
        next(error);
    }
};

export const getSharedFile = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const shareToken = req.params.shareToken as string;
        
        const file = await getPublicFileByToken(shareToken);

        return res.status(200).json({
            success:true,
            data:file
        });

    } catch (error) {
        next(error);
    }
};


export const downloadFile = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
      const userId= req.user?.userId;
      
      if(!userId){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
      }

      const fileId = req.params.id as string;

      const file = await getFileForDownload(fileId,userId);

      const fileBuffer = await storageService.getFile(file.storageKey, file.storageFileId ?? undefined);

      res.setHeader(
        "Content-Type",file.mimeType
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.originalName}"`
      );

      res.setHeader("Content-Length",file.size.toString());

      return res.send(fileBuffer);
    } catch (error) {
        next(error);
    }
}


export const downloadSharedFile = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const sharedToken = req.params.sharedToken as string;

        if(!sharedToken){
            return res.status(400).json({
                success:false,
                message:"Share token is required"
            });
        }

        const file = await getPublicFileByToken(sharedToken);

        const fileBuffer = await storageService.getFile(file.storageKey,file.storageFileId ?? undefined);

         res.setHeader(
            "Content-Type",
            file.mimeType
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.originalName}"`
        );

        res.setHeader(
            "Content-Length",
            file.size.toString()
        );

        return res.send(fileBuffer);
        
    } catch (error) {
        next(error);
    }
};

export const previewFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const fileId = req.params.id as string;

        const file = await getFileForDownload(
            fileId,
            userId
        );

        const fileBuffer =
            await storageService.getFile(
                file.storageKey,
                file.storageFileId ?? undefined
            );

        res.setHeader(
            "Content-Type",
            file.mimeType
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename="${file.originalName}"`
        );

        res.setHeader(
            "Content-Length",
            file.size.toString()
        );

        return res.send(fileBuffer);

    } catch (error) {
        next(error);
    }
};

export const updateStarred = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const fileId = req.params.id as string;

        const { isStarred } = req.body;

        if (typeof isStarred !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isStarred must be a boolean",
            });
        }

        const file = await updateFileStarred(
            fileId,
            userId,
            isStarred
        );

        return res.status(200).json({
            success: true,
            message: isStarred
                ? "File starred successfully"
                : "File unstarred successfully",
            data: file,
        });
    } catch (error) {
        next(error);
    }
};