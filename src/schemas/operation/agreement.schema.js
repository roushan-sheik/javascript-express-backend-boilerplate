import mongoose from "mongoose";

const agreementSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "transport_requests", required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "offer_transportations", required: true },
    finalPrice: { type: Number, required: true },
    requesterConfirmation: { type: Boolean, default: false },
    transporterConfirmation: { type: Boolean, default: false },
    paymentStatus: {
        type: String,
        enum: ["pending", "authorized", "completed", "failed", "cancelled"],
        default: "pending",
    },
    paymentReleased: { type: Boolean, default: false },
    completedAt: { type: Date },
}, { timestamps: true, versionKey: false });

const Agreement = mongoose.model("agreements", agreementSchema);

export default Agreement;
