import catchAsync from "../utils/catch.async.js";
import ApiError from "../utils/api.error.js";
import User from "../schemas/operation/user.schema.js";
import {passwordChangedTemplate} from "../services/email_template.service.js";
import {emailHelper} from "../utils/email.helper.js";
import successResponse from "../utils/success.response.js";
import {logError} from "../utils/log.error.js";



export const changePassword = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { newPassword, oldPassword } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    const isCorrect = await user.correctPassword(oldPassword, user.password);
    if (!isCorrect) {
        return next(new ApiError("Current password is incorrect", 401));
    }


    user.password = newPassword;
    await user.save({ validateBeforeSave: false });


    const html = passwordChangedTemplate(user.fullName);
    const text = `Hi ${user.fullName}, your password has been changed. If this wasn't you, please contact support.`;


    try {
        await emailHelper({
            to: user.email,
            subject: "🔐 Password Changed Successfully",
            message: text,
            html,
        });
    } catch (err) {
        logError("Password change email failed:", err)
    }

    return successResponse({
        res,
        code: 200,
        success: true,
        message: "Password changed successfully",
        data: null,
    });
});
