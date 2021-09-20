import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const SiteSettingSchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    siteTitle: {
        type: String,
        required: true,

    },
    mainDescription: {
        type: String,
    },
    secondDescription: {
        type: String,
    },
    keywords: {
        type: String,
    },
    logo: {
        type: String,
    },
    icon: {
        type: String,
    },
    updatingStatus: {
        type: Boolean,
        default: false,
    },
    updatingStatusText: {
        type: String,
    },
    footerDescription: {
        type: String,
    },
    copyright: {
        type: String,
    },
    tel1: {
        type: String,
    },
    tel2: {
        type: String,
    },
    tel3: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
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
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    examCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "branches",
        },
    ],
    courseCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "branches",
        },
    ],
    webinarCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "branches",
        },
    ],
});


export default model('site-settings', SiteSettingSchema);