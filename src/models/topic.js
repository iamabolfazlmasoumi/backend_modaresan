import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const TopicSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seasons"
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


export default model('topics', TopicSchema);