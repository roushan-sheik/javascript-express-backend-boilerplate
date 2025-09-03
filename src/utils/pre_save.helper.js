export const trimAllStrings = (schema) => {
    schema.pre("save", function (next) {
        const trimStrings = (obj) => {
            if (typeof obj !== 'object' || obj === null) return obj;

            if (Array.isArray(obj)) {
                return obj.map(item =>
                    typeof item === 'string' ? item.trim() : trimStrings(item)
                );
            }

            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'string') {
                    result[key] = value.trim();
                } else if (typeof value === 'object' && value !== null) {
                    result[key] = trimStrings(value);
                } else {
                    result[key] = value;
                }
            }
            return result;
        };
        const trimmed = trimStrings(this.toObject());
        Object.assign(this, trimmed);

        next();
    });
};