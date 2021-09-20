import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const GroupSchema = new Schema({
    title: {
        type: String,
        required: true

    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    subBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sub-branches",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});


export default model('groups', GroupSchema);