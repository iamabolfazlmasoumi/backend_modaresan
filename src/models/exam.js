import mongoose, {model, Schema} from "mongoose";

// Create Schema
const ExamSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    bookletNumber: {
        type: Number,
    },
    isPdfVersion: {
        type: Boolean,
        default: false,
    },
    code: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    isEdited: {
        type: Boolean,
        default:false
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    imageName: {
        type: String,
        default: "no-image.jpg"
    }
});

export default model("exams", ExamSchema);
