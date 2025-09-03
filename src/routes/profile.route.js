import {Router} from 'express';
import {protect} from "../middlewares/auth.middleware.js";
import {getProfile, upsertProfile} from "../controllers/profile.controller.js";
import upload from "../middlewares/multer.middleware.js";
import {profileSchemas} from "../utils/schema.validator.js";
import {validate} from "../middlewares/validate.middleware.js";
const router = Router();

router.use(protect);

router.get('/',getProfile);
router.post('/',validate(profileSchemas.upsertProfile),upload.single('file'), upsertProfile);

export default router;