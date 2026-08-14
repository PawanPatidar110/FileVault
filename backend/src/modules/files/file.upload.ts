import path from "node:path";
import os from "node:os";
import multer from "multer";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "./file.validation.js";

const uploadDirectory = path.join(os.tmpdir(),"filehub-uploads");


const storage = multer.diskStorage({
    destination:uploadDirectory,
    filename:(_req,file,callback) => {
        const extension = path.extname(file.originalname);
        callback(null,`${crypto.randomUUID()}${extension}`);
    }
});

export const upload = multer({storage,
    limits:{
        fileSize:MAX_FILE_SIZE
    },
    fileFilter:(_req,file,callback) => {
        if(!ALLOWED_MIME_TYPES.has(file.mimetype)){
            return callback(
                new Error(
                    `File type ${file.mimetype} is not allowed`
                )
            );
        }
        callback(null,true);
    }
});