import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const AnswerSheetSchema = new Schema({
    answers: [],
    isDeleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    booklet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booklets"
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});


export default model('answer-sheets', AnswerSheetSchema);