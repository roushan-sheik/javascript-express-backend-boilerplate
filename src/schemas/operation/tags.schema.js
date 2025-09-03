import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema(
    {
        tag: {
            type: String,
            required: [true, "Tag name is required"],
            trim: true,
            minlength: [2, "Tag must be at least 2 characters long"],
            maxlength: [30, "Tag cannot exceed 30 characters"],
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

const Tag = mongoose.model("Tag", tagsSchema);

export default Tag;
