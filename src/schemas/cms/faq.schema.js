import mongoose from 'mongoose';
import {multilingualString} from "../../utils/schema.helper.js";
import {trimAllStrings} from "../../utils/pre_save.helper.js";

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            trim: true,
            required: [true, `Please enter question in English`],
            minlength: [5, `English question must be at least 5 characters`],
            maxlength: [200, `English question cannot exceed 200 characters`],
        },
        questionDn: {
            type: String,
            trim: true,
            required: [true, `Please enter question in Danish`],
            minlength: [5, `Danish question must be at least 5 characters`],
            maxlength: [200, `Danish question cannot exceed 200 characters`],
        },
        answer: {
            type: String,
            trim: true,
            required: [true, `Please enter answer in English`],
            minlength: [5, `English answer must be at least 5 characters`],
            maxlength: [300, `English answer cannot exceed 300 characters`],
        },
        answerDn: {
            type: String,
            trim: true,
            required: [true, `Please enter answer in Danish`],
            minlength: [5, `Danish answer must be at least 5 characters`],
            maxlength: [300, `Danish answer cannot exceed 300 characters`],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        views: {
            type: Number,
            default: 0,
            min: [0, "Views cannot be negative"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

trimAllStrings(faqSchema);

const Faq = mongoose.model('faqs', faqSchema);

export default Faq;
