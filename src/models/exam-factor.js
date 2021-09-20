import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const ExamFactorSchema = new Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams"
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    code: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
    },
    totalPrice: {
        type: Number,
    },
    payablePrice: {
        type: Number,
    },
    totalDiscount: {
        type: Number,
    },
    serverCost: {
        type: Number,
    },
    examCost: {
        type: Number,
    },
    questionsCount: {
       type: Number, 
    },
    rulesAcception: {
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
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
        default: null,
    }
});


export default model('exam-factors', ExamFactorSchema);