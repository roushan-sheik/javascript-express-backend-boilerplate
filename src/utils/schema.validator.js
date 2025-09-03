import z from "zod";

const danishPhoneRegex = /^(?:\+45|0045)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;

const emailSchema = () => z.string().min(1, {message: "This field is required."}).email("Please enter a valid email address.").trim().refine((email) => email.includes("..") === false, {
        message: "Email contains invalid characters(consecutive dots)"
    }
);

export const authSchemas = {
    login: z.object({
        body: z.object({
            email: emailSchema(),
            password: z.string().min(8, "Password must be at least 8 characters"),
        }),
    }),
    createUser: z.object({
        body: z.object({
            fullName: z.string().min(2, "Full name must be at least 2 characters"),
            email: emailSchema(),
            password: z.string().min(8, "Password must be at least 8 characters"),
            address: z.string().min(1, "Address is required"),
            phone: z.string().transform((val) => val.replace(/\s+/g, "")),
            agreeToTerms: z.literal(true).refine((val) => val === true, {
                message: "You must agree to the Terms and Conditions.",
            }),
        }),
    }),
    forgotPassword: z.object({
        body: z.object({
            email: emailSchema(),
        })
    }),
    optVerify: z.object({
        body: z.object({
            email: emailSchema(),
            otp: z.string().length(6, "OTP must be exactly 6 digits."),
        }),
    }),
    resetPassword: z.object({
        body: z.object({
            newPassword: z.string().min(8, "Password must be at least 8 characters."),
            token: z.string().nonempty("Reset token must be a valid string."),
        }),
    }),
};


export const profileSchemas = {
   upsertProfile: z.object({
       body: z.object({
           fullName: z.string().min(2, "Full name must be at least 2 and max 30 characters").max(30).optional(),
           street: z.string().optional(),
           country: z.string().optional(),
           suburb: z.string().optional(),
           bio: z.string().min(5, "Bio must be at least 5 characters").optional(),
           transportFacility: z.string().optional(),
           postalCode: z.string().optional(),
       })
   })
};


export const settingsSchemas = {
    changePassword: z.object({
        body: z.object({
            oldPassword: z.string().min(8, "Password must be at least 8 characters"),
            newPassword: z.string().min(8, "Password must be at least 8 characters"),
            confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
        }).refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }),
    }),
};


export const faqSchemas = {
    createFaq: z.object({
        body: z.object({
            question: z.string().min(5).max(300),
            questionDn: z.string().min(5).max(300),
            answer: z.string().min(5).max(1000),
            answerDn: z.string().min(5).max(1000),
        }),
    }),

    updateFaq: z.object({
        body: z.object({
            question: z.string().min(5).max(300).optional(),
            questionDn: z.string().min(5).max(300).optional(),
            answer: z.string().min(5).max(1000).optional(),
            answerDn: z.string().min(5).max(1000).optional(),
        }),
    }),
    paramFaq: z.object({
        params: z.object({
            id: z.string().min(1, "FAQ ID is required"),
        }),
    }),
};


