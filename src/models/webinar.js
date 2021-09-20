import {model, Schema} from "mongoose";

// Create Schema
const WebinarSchema = new Schema({
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

export default model("webinars", WebinarSchema);