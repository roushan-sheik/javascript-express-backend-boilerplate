import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {trimAllStrings} from "../../utils/pre_save.helper.js";

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: [true, "Please enter a full name"], trim: true, minLength: 2, maxLength: 30},
    email: {
        type: String,
        required: [true, "Please enter a valid email address"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        trim: true,
        minLength: 8,
        select: false
    },
    phone: {type: String, required: [true, "Please enter a valid phone number"],set: v => v.replace(/\s+/g, ""),},
    address: {type: String, required: [true, "Please enter a valid address"], trim: true},
    agreeToTerms: {type: Boolean, required: [true, "Please enter agree to Terms"]},
    isBiometric: {type: Boolean, default: false},
    isGps: {type: Boolean, default: false},
    avatar: {type: String},
    role: {type: String, default: "USER", enum: ["ADMIN", "TRANSPORTER", "USER"]},
    isTransportation: {type: Boolean, default: false},
    language: {type: String, enum: ['en', 'dn'],default: 'en'},
    latitude: {type: String},
    longitude: {type: String},
    postalCode: {type: Number},
    transportFacility: {type: String},
    bio: {type: String},
    suburb: {type: String},
    country: {type: String},
    street: {type: String},
    status: {
        type: String,
        default: "pending",
        enum: ['active', 'inactive', 'pending', 'suspended', 'blocked', 'locked', 'deleted']
    },
    isPushNotification: {type: Boolean, default: false},

    // Login tracking
    loginHistory: {type: [Date], default: []},

    // OTP functionality
    otp: {type: String},
    otpExpires: {type: Date},
    isOtpVerified: {type: Boolean,},
    verifiedAt: {type: Date},

    // Password reset
    passwordResetToken: {type: String, select: false},
    passwordResetExpires: {type: Date, select: false},
    passwordChangedAt: {type: Date, select: false},
}, {timestamps: true, versionKey: false});

//index
userSchema.index({otp: 1, otpExpires: 1});
userSchema.index({loginHistory: 1});
userSchema.index({status: 1}, {partialFilterExpression: {status: "active"}});
userSchema.index({phone: 1}, { sparse: true});


// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);

    if (!this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }
    next();
});

// Compare entered password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Track login history (last 5)
userSchema.methods.addLoginHistory = async function () {
    this.loginHistory.unshift(new Date());
    if (this.loginHistory.length > 5) {
        this.loginHistory = this.loginHistory.slice(0, 5);
    }
    await this.save({validateBeforeSave: false});
};

// Generate OTP (valid for 15 min)
userSchema.methods.generateOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (enteredOtp) {
    if (!this.otp || !this.otpExpires) return false;
    const isValid = this.otp === enteredOtp && this.otpExpires > Date.now();
    if (isValid) {
        this.isOtpVerified = true;
        this.verifiedAt = new Date();
        this.otp = undefined;
        this.otpExpires = undefined;
    }
    return isValid;
};

// Generate Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};


trimAllStrings(userSchema);

const User = mongoose.model("users", userSchema);
export default User;
