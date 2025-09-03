import mongoose from "mongoose";

const weightCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Weight category name is required"],
            trim: true,
            minlength: [2, "Weight category name must be at least 2 characters long"],
            maxlength: [50, "Weight category name cannot exceed 50 characters"],
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save hook to ensure name is trimmed (extra safety)
weightCategorySchema.pre("save", function (next) {
    if (this.isModified("name") && this.name) {
        this.name = this.name.trim();
    }
    next();
});

const WeightCategory = mongoose.model("WeightCategory", weightCategorySchema);

export default WeightCategory;
