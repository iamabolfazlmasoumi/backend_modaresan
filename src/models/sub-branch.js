import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const SubBranchSchema = new Schema({
    title: {
        type: String,
        required: true

    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches",
        required: true
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


export default model('sub-branches', SubBranchSchema);