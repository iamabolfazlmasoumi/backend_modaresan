import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const ExamProductionSchema = new Schema({
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
    isDeleted: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    webcamActive: {
        type: Boolean,
        default: false,
    },
    soundActive: {
        type: Boolean,
        default: false,
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
    isEdited: {
        type: Boolean,
        default: false
    }
});


export default model('exam-productions', ExamProductionSchema);