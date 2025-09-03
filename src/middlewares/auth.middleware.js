
import ApiError from "../utils/api.error.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catch.async.js";
import User from "../schemas/operation/user.schema.js";


export const protect = catchAsync(async (req, res, next) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError('Unauthorized: No token provided', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ApiError('Unauthorized: Token expired', 401));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(new ApiError('Unauthorized: Invalid token', 401));
        }
        return next(new ApiError('Unauthorized: Token verification failed', 401));
    }

    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (!user) {
        return next(new ApiError('User no longer exists', 401));
    }

    if (user.changedPasswordAfter(decoded.iat)) {
        return next(new ApiError('Password changed recently. Please log in again', 401));
    }

    req.user = user;
    next();
});



// Role-based restriction middleware
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new ApiError(`Access denied. Only ${roles.join(' or ')} allowed.`, 403));
        }
        next();
    };
};
