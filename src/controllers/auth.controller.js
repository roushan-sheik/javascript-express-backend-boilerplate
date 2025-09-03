import catchAsync from "../utils/catch.async.js";
import User from "../schemas/operation/user.schema.js";
import successResponse from "../utils/success.response.js";
import {otpEmailTemplate} from "../services/email_template.service.js";
import {emailHelper} from "../utils/email.helper.js";
import ApiError from "../utils/api.error.js";
import AuthHelper from "../utils/auth.helper.js";

const OTP_CONFIG = {
    expiresMinutes: 15,
};

// Create Account
export const createAccount = catchAsync(async (req, res, next) => {
    const reqBody = req.body;
    const newUser = await User.create({
        ...reqBody,
        avatar: `https://ui-avatars.com/api/?name=${
            encodeURIComponent(reqBody.fullName?.trim() || "U")
        }&background=random&color=fff`,
    });
    successResponse({
        res,
        code: 201,
        success: true,
        message: "Account created successfully",
        data: newUser,
    });
});


//Admin Login
export const adminLogin = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    const admin = await User.findOne({email}).select("+password");
    if (!admin) {
        return next(new ApiError("Unauthorized", 401));
    }

    if (admin.role !== "ADMIN") {
        return next(new ApiError("Access denied. Admins only.", 403));
    }
    const isMatch = await admin.correctPassword(password, admin.password);
    if (!isMatch) return next(new ApiError("Invalid email or password!", 401));
    const token = AuthHelper.generateToken({
        id: admin._id,
        email: admin.email,
        role: admin.role,
    });

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    await admin.addLoginHistory();
    await admin.save({validateBeforeSave: true});

    return successResponse({
        res,
        code: 200,
        success: true,
        message: 'Admin login successful',
        data: {
            token,
            user: {
                role: admin.role
            }
        },
    });
});


//Logout
export const logout = catchAsync(async (req, res, next) => {
    res.clearCookie('token');
    successResponse({
        res,
        code: 200,
        success: true,
        message: 'Logout successfully',
        data: null
    })
});


//Forgot Password
export const forgotPassword = catchAsync(async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email}).select("+otp");
    if (!user) return successResponse({
        res,
        code: 202,
        success: true,
        message: 'If an account exists, an OTP will be sent to your email',
        data: null,
    });

    const otp = await user.generateOtp();

    const html = otpEmailTemplate({
        title: "Reset Your Password",
        otp,
        name: user.fullName
    });

    const result = await emailHelper({
        to: email,
        subject: '🔐 Password Reset Request',
        message: `Your password reset OTP is ${otp}. It will expire in ${OTP_CONFIG.expiresMinutes} minutes.`,
        html,
        next
    });

    if (result.accepted && result.accepted.length > 0) {
        await user.save({validateBeforeSave: false});

        return successResponse({
            res,
            code: 200,
            success: true,
            message: "An OTP has been sent to your email",
            data: null,
        });
    }

    return next(new ApiError("Failed to send OTP email. Please try again later.", 500));
});


//Verify OTP
export const verifyOtp = catchAsync(async (req, res, next) => {
    const {email, otp} = req.body;

    const user = await User.findOne({email}).select("+otp");
    if (!user) return next(new ApiError('User not found', 404));

    const isValid = user.verifyOTP(otp);
    if (!isValid) return next(new ApiError('Invalid or expired OTP', 401));

    const resetToken = user.createPasswordResetToken();

    await user.save({validateBeforeSave: false});

    return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        data: {
            resetToken,
            expiresIn: '10 minutes',
        }
    });
});


// Reset Password
export const resetPassword = catchAsync(async (req, res, next) => {
    const {newPassword, token} = req.body;

    const hashedToken = AuthHelper.hashToken(token);

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()},
    }).select('+password +passwordResetToken +passwordResetExpires +passwordChangedAt');

    if (!user) return next(new ApiError('Invalid or expired reset token', 401));

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date();

    await user.save({validateBeforeSave: false});

    return successResponse({
        res,
        code: 200,
        success: true,
        message: 'Password reset successfully',
        data: null
    });
});

