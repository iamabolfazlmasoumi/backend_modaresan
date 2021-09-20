import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const SubGroupSchema = new Schema({
    title: {
        type: String,
        required: true

    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups",
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


export default model('sub-groups', SubGroupSchema);