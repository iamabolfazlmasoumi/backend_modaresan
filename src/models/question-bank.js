import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const QuestionBankSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lessons"
    },
    isDeleted: {
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


export default model('question-banks', QuestionBankSchema);
