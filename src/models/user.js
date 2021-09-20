import mongoose, {model, Schema} from "mongoose";
// Create Schema
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    isEmailActive: {
        type: Boolean,
        default: false,
    },
    nationalCode: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    birthDate: {
        type: Date,
        default: null,
    },
    address: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "provinces",
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cities",
    },
    skills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "sub-groups",
        },
    ],
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
    },
    biography: {
        type: String,
    },
    activationCode: {
        type: Number,
    },
    telegram: {
        type: String,
    },
    instagram: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    googleAuthenticator: {
        type: Boolean,
        default: false,
    },
    loginSms: {
        type: Boolean,
        default: false,
    },
    smsNewsletter: {
        type: Boolean,
        default: false,
    },
    emailNewsletter: {
        type: Boolean,
        default: false,
    },

    failedTries: {
        type: Number,
        default: 0,
    },
    lastFailedSigninTry: {
        type: Date,
        default: null,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
        default: null,
    },
});

export default model("users", UserSchema);
