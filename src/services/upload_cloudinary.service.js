import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const uploadToCloudinary = (buffer, fileType, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: fileType.startsWith("video") ? "video" : "image",
                folder,
                eager: fileType.startsWith("video")
                    ? [
                        {
                            width: 400,
                            height: 300,
                            crop: "thumb",
                            gravity: "auto",
                            format: "jpg",
                        },
                    ]
                    : undefined,
                eager_async: fileType.startsWith("video"),
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });
};