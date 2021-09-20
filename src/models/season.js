import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const SeasonSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lessons"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
});


export default model('seasons', SeasonSchema);
