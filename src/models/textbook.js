import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const TextBookSchema = new Schema({
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


export default model('textbooks', TextBookSchema);