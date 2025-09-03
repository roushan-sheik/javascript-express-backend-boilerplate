import mongoose from "mongoose";

const userTransportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true,"User ID is required"]
    },
    transportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transports",
        required: [true, "Transport ID is required"]
    },
    isActive:{type:Boolean,default:true}
}, { timestamps: true, versionKey: false });

// Prevent duplicate user-transport assignments
userTransportSchema.index({ userId: 1, transportId: 1 }, { unique: true });

const UserTransport = mongoose.model("user_transports", userTransportSchema);
export default UserTransport;
