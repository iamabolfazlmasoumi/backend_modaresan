import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const LessonSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches"
    },
    subBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sub-branches"
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups"
    },
    subGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sub-groups"
    },
    fiscalYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fiscal-years"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: null,
    },
});


export default model('lessons', LessonSchema);