import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const PdfAnswerSchema = new Schema({
    answers: {
        type: Array,
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams"
    },
     booklet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booklets"
    },
    bookletQuestionsCount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    isMain: {
        type: Boolean,
        default: false
    }
});


export default model('pdf-answers', PdfAnswerSchema);