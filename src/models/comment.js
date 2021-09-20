import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const CommentSchema = new Schema({
    body: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ["isSent","accepted", "rejected"],
        default: "isSent",
    },
    type: {
        type: String,
        enum: [ "exam", "webinar", "course" ],
        default: "exam"
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams",
    },
    // webinar: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "webinars",
    // },
    // course: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "courses",
    // },
});


export default model('comments', CommentSchema);