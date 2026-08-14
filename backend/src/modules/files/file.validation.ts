import z from "zod";

export const fileUploadMetaDataSchema = z.object({
    visibility:z.enum(["PRIVATE","PUBLIC"]).default("PRIVATE")
});

export const MAX_FILE_SIZE = 100 *1024 * 1024;

export const ALLOWED_MIME_TYPES = new Set([
      "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/zip",
  "application/json",
]);