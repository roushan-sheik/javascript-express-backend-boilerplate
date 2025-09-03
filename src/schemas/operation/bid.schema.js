import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "transport_requests" },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "offer_transportations" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    bidAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, { timestamps: true, versionKey: false });

const Bid = mongoose.model("bids", bidSchema);

export default Bid;
