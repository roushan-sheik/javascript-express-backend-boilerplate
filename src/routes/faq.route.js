import {Router} from "express";
import {protect, restrictTo} from "../middlewares/auth.middleware.js";
import {validate} from "../middlewares/validate.middleware.js";
import {faqSchemas} from "../utils/schema.validator.js";
import {createFaq, updateFaq, getFaqs, deleteFaq, manageFaqStatus} from "../controllers/faq.controller.js";


const router = Router();

router.post('/',protect,restrictTo('ADMIN'),validate(faqSchemas.createFaq),createFaq);
router.put('/:id',protect,restrictTo('ADMIN'),validate(faqSchemas.updateFaq),updateFaq);
router.get('/',getFaqs);
router.delete('/:id',protect,restrictTo('ADMIN'),validate(faqSchemas.paramFaq),deleteFaq);
router.put('/status/:id',protect,restrictTo('ADMIN'),validate(faqSchemas.paramFaq),manageFaqStatus);

export default router;