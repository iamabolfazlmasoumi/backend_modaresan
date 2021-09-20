import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const ExamBasicSchema = new Schema({
    referenceId: {
        type: String,
        default: null
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches",
    },
    subBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sub-branches",
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups",
    },
    subGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sub-groups",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    withCertificate: {
        type: Boolean,
        default: false,
    },
    // withCertificateAccepted: {
    //     type: Boolean,
    //     default: null,
    // },
    // withCertificateAnswered: {
    //     type: Date,
    //     default: null,
    // },
    // withCertificateMessage: {
    //     type: String,
    //     default: null,
    // },
    organization: {
        type: String,
        default: null
    },
    organizationAccepted: {
        type: Boolean,
        default: null,
    },
    organizationAnswered: {
        type: Date,
        default: null,
    },
    organizationMessage: {
        type: String,
        default: null,
    },
    organizationCode: {
        type: String,
        default: null
    },
    organizationCodeAccepted: {
        type: Boolean,
        default: null,
    },
    organizationCodeAnswered: {
        type: Date,
        default: null,
    },
    organizationCodeMessage: {
        type: String,
        default: null,
    },
    referenceFile: {
        type: String,
        default: null
    },
    referenceFileAccepted: {
        type: Boolean,
        default: null,
    },
    referenceFileAnswered: {
        type: Date,
        default: null,
    },
    referenceFileMessage: {
        type: String,
        default: null,
    },
    withNegativePoint: {
        type: Boolean,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    isSent: {
        type: Boolean,
        default: false,
    },
    requestSentAt: {
        type: Date,
        default: null,
    },
    isAccepted: {
        type: Boolean,
        default: null,
    },
    requestAcceptedAt: {
        type: Date,
        default: null
    },
    isRejected: {
        type: Boolean,
        default: null,
    },
    requestRejectedAt: {
        type: Date,
        default: null
    },
});


export default model('exam-basics', ExamBasicSchema);