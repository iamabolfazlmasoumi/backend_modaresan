import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const examPublishSchema = new Schema({
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
    joinTimeLimitation: {
        type: Boolean,
        default: false
    },
    registerTime: {
        type: Date,
        default: null
    },
    registerTimeAccepted: {
        type: Boolean,
        default: null,
    },
    registerTimeAnswered: {
        type: Date,
        default: null,
    },
    registerTimeMessage: {
        type: String,
        default: null,
    },
    startTime: {
        type: Date,
        default: null
    },
     startTimeAccepted: {
        type: Boolean,
        default: null,
    },
    startTimeAnswered: {
        type: Date,
        default: null,
    },
    startTimeMessage: {
        type: String,
        default: null,
    },
    price: {
        type: Number,
        default: 0,
    },
     priceAccepted: {
        type: Boolean,
        default: null,
    },
    priceAnswered: {
        type: Date,
        default: null,
    },
    priceMessage: {
        type: String,
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
        default: false,
    },
    isSent: {
        type: Boolean,
        default: false
    }
});


export default model('exam-publishes', examPublishSchema);