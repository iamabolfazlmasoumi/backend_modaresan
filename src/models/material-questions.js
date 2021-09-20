import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const MaterialQuestionsSchema = new Schema({
    bookletMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booklet-materials"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booklet-materials"
    },
    bankQuestionsCount: {
        type: Number,
        default: null,
    },
    isRandomSelection: {
        type: Boolean,
        default: false,
    },
    hardQuestionsCount: {
        type: Number,
        default: null,
    },
    simpleQuestionsCount: {
        type: Number,
        default: null,
    },
    privateQuestionsCount: {
        type: Number,
        default: null,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions"
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});


export default model('material-questions', MaterialQuestionsSchema);