import ApiError from "../utils/api.error.js";
import { ZodError } from "zod";

export const validate = (schema) => (req, _res, next) => {
    try {
        req.validated = schema.parse({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        next();
    } catch (e) {
        if (e instanceof ZodError) {
            console.error(e);
            const fieldErrors = {};

            e.issues.forEach(err => {
                const path = err.path.join(".") || "body";
                if (!fieldErrors[path]) fieldErrors[path] = [];
                fieldErrors[path].push(err.message);
            });
            return next(new ApiError("Validation failed", 400, { fieldErrors }));
        }
        next(e);
    }
};
