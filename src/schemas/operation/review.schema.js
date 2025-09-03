import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    agreementId: { type: mongoose.Schema.Types.ObjectId, ref: "agreements", required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
}, { timestamps: true, versionKey: false });

const Review = mongoose.model("reviews", reviewSchema);

export default Review;
