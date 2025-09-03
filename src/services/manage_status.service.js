import catchAsync from "../utils/catch.async.js";
import ApiError from "../utils/api.error.js";
import successResponse from "../utils/success.response.js";

export const manageStatusService = (Model,item) => catchAsync(async (req, res, next) => {
    const {id} = req.params;

    const target = await Model.findOne({ _id: id });

    if (!target) {
        return next(new ApiError("No ad found with the provided ID.", 404));
    }

    target.isActive = !target.isActive;
    await target.save();

    return successResponse({
        res,
        code: 200,
        success: true,
        message: target.isActive
            ? `${item} published successfully.`
            : `${item} unpublished successfully.`,
        data: target,
    });
})