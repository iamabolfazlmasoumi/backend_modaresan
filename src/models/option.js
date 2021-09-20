import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const OptionSchema = new Schema({
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
    point: {
        type: Number,
        required: true,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions"
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
});


export default model('options', OptionSchema);