import catchAsync from "../utils/catch.async.js";
import ApiError from "../utils/api.error.js";
import successResponse from "../utils/success.response.js";


export const createService = (Model) => catchAsync(async (req, res, next) => {
    const data = req.body;

    const doc = await Model.create(data);
    if (!doc) {
        return next(new ApiError("Failed to create service", 500));
    }

    return successResponse({
        res,
        code: 201,
        success: true,
        message: `${Model.modelName} created successfully`,
        data: doc,
    });
});


export const updateService = (Model) => catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const filterEmpty = (obj) =>
        Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined && v !== null && v !== "")
                .map(([k, v]) => [k, typeof v === "object" && !Array.isArray(v) ? filterEmpty(v) : v])
        );

    const filteredBody = filterEmpty(req.body);

    const updatedData = await Model.findByIdAndUpdate(
        id,
        filteredBody,
        {
            new: true,
        }
    );

    if (!updatedData) {
        return next(new ApiError(`${Model.modelName} not found`, 404));
    }

    return successResponse({
        res,
        code: 200,
        success: true,
        message: `${Model.modelName} updated successfully`,
        data: updatedData,
    });
});


export const deleteService = (Model) => catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const deletedItem = await Model.findByIdAndDelete(id);

    if (!deletedItem) {
        return next(new ApiError(`${Model.modelName} not found`, 404));
    }

    return successResponse({
        res,
        code: 200,
        success: true,
        message: `${Model.modelName} deleted successfully`,
        data: null,
    });
});
