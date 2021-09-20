import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const QuestionSchema = new Schema({
    text: {
        type: String,
    },
    code: {
        type: String,
    },
    answer: {
        type: String,
    },
    fiscalYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fiscal-years"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    qbank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question-banks"
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lessons"
    },
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seasons"
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topics"
    },
    difficulty: {
        type: String,
        enum: ['hard', 'simple'],
        default: 'simple',
    },
    optionsCount: {
        type: Number,
    },
    resource: {
        type: String,
    },
    image: {
        type: String,
    },
    textbook: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    type: {
        type: Number,
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


export default model('questions', QuestionSchema);
