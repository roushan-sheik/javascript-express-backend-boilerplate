import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import ApiError from "./api.error.js";

const OTP_CONFIG = { expiresMinutes: 30 };

class AuthHelper {
    static generateToken({ id, email, role }) {
        return jwt.sign(
            { id, email, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }

    static generateOTP(length = 4) {
        const min = 10 ** (length - 1);
        const max = 10 ** length - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    static hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    static isValidEmail(email) {
        return !!email && /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
    }

    static isExpired(timestamp) {
        return !timestamp || timestamp < Date.now();
    }

    static minutesUntil(futureTime) {
        return Math.ceil((futureTime - Date.now()) / (60 * 1000));
    }

    static validateEmailAndOTP({ email, otp }, next) {
        if (!email || !otp) return next(new ApiError('Email and OTP are required!', 400));
        if (!this.isValidEmail(email)) return next(new ApiError('Invalid email format.', 400));
    }

    static validateEmail(email, next) {
        if (!email) return next(new ApiError('Email is required', 400));
        if (!this.isValidEmail(email)) return next(new ApiError('Invalid email format.', 400));
    }

    static validateUserActive(user, next) {
        if (!user) return next(new ApiError('User not found', 400));
        if (user.isDeleted) return next(new ApiError('Account has been deleted', 400));
        if (!user.verify_otp) return next(new ApiError('Please verify your account before logging in.', 400));
        if (user.isActive) return next(new ApiError('User account is already active', 400));
        return next();
    }

    static checkOtpResendAllowed(user, next) {
        if (user.otpExpires && user.otpExpires > Date.now()) {
            const minutesLeft = this.minutesUntil(user.otpExpires);
            return next(new ApiError(`Please wait ${minutesLeft} minute(s) before requesting a new OTP`, 429));
        }
        return next();
    }

    static checkPasswordResetTokenExpiry(user, next) {
        if (user.passwordResetExpires && user.passwordResetExpires > Date.now()) {
            return next(new ApiError('You already have a valid reset token. Please use that or wait until it expires.', 429));
        }
        return next();
    }

    static generateOTPExpiry(minutes = OTP_CONFIG.expiresMinutes) {
        return new Date(Date.now() + minutes * 60 * 1000);
    }
}

export default AuthHelper;
