import mongoose, {model, Schema} from "mongoose";

// Create Schema
const WalletSchema = new Schema({
    walletType: {
        type: String,
        enum: ["withdraw", "deposit"],
        default: null,
    },
    amount: {
        type: Number,
        default: 0,
    },
    code: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null,
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

export default model("wallets", WalletSchema);