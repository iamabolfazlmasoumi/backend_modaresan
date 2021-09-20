import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const AnswerSchema = new Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions"
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


export default model('answers', AnswerSchema);