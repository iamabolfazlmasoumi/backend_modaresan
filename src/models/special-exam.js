import mongoose, {model, Schema} from "mongoose";

// Create Schema
const SpecialExamSchema = new Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    duration: {
        type: String,
        enum: ["1Month", "2Month", "3Month"],
        default: null,
    },
    status: {
        type: String,
        enum: ["created", "active", "deActive"],
        default: "created",
    },
    startTime: {
        type: Date,
        default: null,
    },
    purchaseTime: {
        type: Date,
        default: null,
    },
    expireTime: {
        type: Date,
        default: null,
    },
});

export default model("special-exams", SpecialExamSchema);
