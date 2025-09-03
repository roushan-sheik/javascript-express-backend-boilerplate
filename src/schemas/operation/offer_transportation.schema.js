import mongoose from "mongoose";

const offerTransportationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [true, "Please choose a user"],
        },
        fromCity: {
            type: String,
            required: [true, "Please choose a departure city"],
        },
        toCity: {
            type: String,
            required: [true, "Please choose a destination city"],
        },
        date: {
            type: Date,
            default: Date.now,
            required: [true, "Please choose a date"],
        },
        flexibleDate: {
            type: Boolean,
            required: [true, "Please specify date flexible"],
        },
        startTime: {
            type: String,
            required: [true, "Please choose a start time"],
        },
        endTime: {
            type: String,
            required: [true, "Please choose an end time"],
            validate: {
                validator: function (v) {
                    if (!this.startTime) return true;
                    return v > this.startTime;
                },
                message: "End time must be after start time",
            },
        },
        flexibleTime: {
            type: Boolean,
            required: [true, "Please specify time flexibility"],
        },
        destination: {
            type: String,
            required: [true, "Please specify a destination"],
        },
        weightCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "weight_categories",
            required: [true, "Please choose a weight category"],
        },
        transportId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transports",
            required: [true, "Please choose a transport"],
        },
        isPersoner: {
            type: Boolean,
            required: [true, "Please specify if a personer is needed"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
        },
        isAllowCounteroffers: {
            type: Boolean,
            required: [true, "Please specify if counteroffers are allowed"],
        },
        multipleTrips: {
            type: Boolean,
            required: [true, "Please specify if multiple trips are allowed"],
        },
        isPetsInCrates: {
            type: Boolean,
            required: [true, "Please specify if pets are in crates"],
        },
        serviceFee: {
            type: Number,
            required: [true, "Please specify a service fee"],
            min: [0, "Service fee cannot be negative"],
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (arr) {
                    return arr.every((img) => typeof img === "string");
                },
                message: "Images must be an array of strings",
            },
        },
        tagWord: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


offerTransportationSchema.pre("save", function (next) {
    ["fromCity", "toCity","startTime", "endTime" ,"destination", "description"].forEach(
        (field) => {
            if (this[field]) this[field] = this[field].trim();
        }
    );
    next();
});

const OfferTransportation = mongoose.model(
    "offer_transportations",
    offerTransportationSchema
);

export default OfferTransportation;
