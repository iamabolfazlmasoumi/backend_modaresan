import mongoose, {model, Schema} from "mongoose";

// Create Schema
const RoleSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: "user",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "permissions",
        },
    ],
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "groups",
        },
    ],
    cities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cities",
        },
    ],
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});

export default model("roles", RoleSchema);
