import {model, Schema} from "mongoose";
// Create Schema
const DepartmentSchema = new Schema({
    title: {
        type: String,
    },
    code: {
        type: String,
    },
    capacity: {
        type: Number,
        default: 0,
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
});

export default model("departments", DepartmentSchema);
