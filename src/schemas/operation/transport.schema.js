import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Transport name is required"],
            trim: true,
            minlength: [2, "Transport name must be at least 2 characters long"],
            maxlength: [50, "Transport name can't exceed 50 characters"],
        },
        image: {
            type: String,
            required: [true, "Transport image is required"],
            trim: true,
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

const Transport = mongoose.model('Transport', transportSchema);

export default Transport;
