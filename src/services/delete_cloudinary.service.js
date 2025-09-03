import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/api.error.js";
import {logError} from "../utils/log.error.js";
import {logWarn} from "../utils/log.warn.js";


export const deleteFromCloudinary = async (url, next) => {
    try {
        if (!url || typeof url !== 'string') {
            next(new ApiError("Invalid URL provided for deletion.", 400))
        }
        const parts = url.split('/');
        const fileName = parts.pop().split('.')[0];
        const folder = parts.slice(parts.indexOf('upload') + 1).join('/');
        const publicId = `${folder}/${fileName}`;

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== 'ok' && result.result !== 'not found') {
            logWarn("Unexpected result from Cloudinary destroy:", result)
        }

        return result;
    } catch (error) {
        logError('Cloudinary deletion error:', error.message || error)
        next(error);
    }
};