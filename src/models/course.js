import {model, Schema} from "mongoose";

// Create Schema
const CourseSchema = new Schema({
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

export default model("courses", CourseSchema);