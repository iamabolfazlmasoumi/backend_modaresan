import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const BookletMaterialSchema = new Schema({
    booklet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booklets"
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lessons"
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams"
    },
    seasons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "seasons"
    }],
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "topics"
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    factor: {
        type: Number,
        default: 1,
    },
    time: {
        type: Number,
        default: 0,
    },
    questionsCount: {
        type: Number,
        default: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    materialPdfFile: {
        type: String,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
});


export default model('booklet-materials', BookletMaterialSchema);