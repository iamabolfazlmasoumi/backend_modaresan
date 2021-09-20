import mongoose, {model, Schema} from "mongoose";

// Create Schema
const OrderSchema = new Schema({
    orderType: {
        type: String,
        enum: ["course", "webinar", "exam", "examprocess"],
        default: null,
    },
    code: {
        type: String,
    },
    payablePrice: {
        type:Number,
    },
    callbackCode: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    mobile: {
        type: String,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams"
    },
    webinar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "webinars"
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses"
    },
    examProcess: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams"
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
        defualt: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

export default model("orders", OrderSchema);