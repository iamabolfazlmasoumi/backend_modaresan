import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const BookletSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
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
    pdfUrl: {
        type: String,
        default: null,
    }
});


export default model('booklets', BookletSchema);