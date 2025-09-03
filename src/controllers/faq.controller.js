import {createService, deleteService, updateService} from "../services/item.service.js";
import Faq from "../schemas/cms/faq.schema.js";
import catchAsync from "../utils/catch.async.js";
import successResponse from "../utils/success.response.js";
import {manageStatusService} from "../services/manage_status.service.js";


export const createFaq = createService(Faq);

export const updateFaq = updateService(Faq);

export const getFaqs = catchAsync(async (req, res, next) => {
    const { lang } = req.query;

    const faqs = await Faq.find({ isActive: true }).sort({ createdAt: -1 });

    const data = faqs.map((faq) => {
        if (lang === "en") {
            return {
                _id: faq._id,
                question: faq.question,
                answer: faq.answer,
                isActive: faq.isActive,
                views: faq.views,
                createdAt: faq.createdAt,
                updatedAt: faq.updatedAt,
            };
        } else if (lang === "dn") {
            return {
                _id: faq._id,
                question: faq.questionDn,
                answer: faq.answerDn,
                isActive: faq.isActive,
                views: faq.views,
                createdAt: faq.createdAt,
                updatedAt: faq.updatedAt,
            };
        } else {
            return faq;
        }
    });

    return successResponse({
        res,
        code: 200,
        success: true,
        message: "FAQs fetched successfully",
        data,
    });
});

export const deleteFaq = deleteService(Faq);

export const manageFaqStatus = manageStatusService(Faq,"Faq");