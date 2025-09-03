export const multilingualString = (
    fieldName,
    min = 5,
    max = 300,
    required = true,
    languages = ["en", "dn"]
) => {
    const schema = {};

    languages.forEach((lang) => {
        schema[lang] = {
            type: String,
            trim: true,
            required: required ? [true, `Please enter ${fieldName} in ${lang}`] : false,
            minlength: [min, `${lang} ${fieldName} must be at least ${min} characters`],
            maxlength: [max, `${lang} ${fieldName} cannot exceed ${max} characters`],
        };
    });

    return schema;
};