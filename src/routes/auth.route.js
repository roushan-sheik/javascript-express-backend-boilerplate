import {Router} from "express";
import {
    adminLogin,
    createAccount,
    forgotPassword,
    logout,
    resetPassword,
    verifyOtp
} from "../controllers/auth.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {authSchemas} from "../utils/schema.validator.js";
import {protect} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",validate(authSchemas.createUser),createAccount);
router.post('/admin-login',validate(authSchemas.login),adminLogin);
router.post('/logout',protect,logout);
router.post('/forgot-password',validate(authSchemas.forgotPassword),forgotPassword);
router.post('/verify-otp',validate(authSchemas.optVerify),verifyOtp);
router.post('/reset-password',validate(authSchemas.resetPassword),resetPassword);

export default router;