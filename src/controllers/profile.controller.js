import catchAsync from "../utils/catch.async.js";
import User from "../schemas/operation/user.schema.js";
import {deleteFromCloudinary} from "../services/delete_cloudinary.service.js";
import {uploadToCloudinary} from "../services/upload_cloudinary.service.js";
import successResponse from "../utils/success.response.js";
import ApiError from "../utils/api.error.js";


export const upsertProfile = catchAsync(async (req, res, next) => {
    const {id} = req.user;

    const filteredBody = Object.fromEntries(
        Object.entries(req.body).filter(
            ([_, value]) => value !== undefined && value !== null && value !== ""
        )
    );

    const user = await User.findById(id);

    if (req.file) {
        if (user?.avatar) await deleteFromCloudinary(user.avatar);
        const imageResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'avatars');
        filteredBody.avatar = imageResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
        new: true,
        runValidators: true,
    }).select("-password");

    successResponse({
        res,
        code: 200,
        success: true,
        message: "Profile successfully updated",
        data: updatedUser,
    });
});


export const getProfile = catchAsync(async (req, res, next) => {
    const {id} = req.user;

    const user = await User.findById(id).select(
        "-password -otp -otpExpires -isOtpVerified -passwordResetToken -passwordResetExpires"
    );
    if (!user) return next(new ApiError('User not found', 404));

    successResponse({
        res,
        code: 200,
        success: true,
        message: "Profile fetched successfully",
        data: user
    });
});