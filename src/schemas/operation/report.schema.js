import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:"users", required: [true, "Need to be platform user"]},
    statement:{type:String,required:[true,"A Statement is required"],trim:true,minLength:[5, "Statement must be at least 5 characters long"]},
    document:{type:String,required:[true,"A Statement is required"],trim:true},
},{
    timestamps: true,versionKey:false
});

const Report = mongoose.model("reports",reportSchema);
export default Report;