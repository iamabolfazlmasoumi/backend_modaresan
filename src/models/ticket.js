import mongoose from 'mongoose';
import {
    model,
    Schema
} from 'mongoose';


// Create Schema 
const TicketSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments"
    },
    // sent => investigating => referenced to related department => replayed 
    status: {
        type: String,
        enum: ["open", "close"],
        default: "open",
    },
    procedure: {
        type: String,
        enum: ["sent", "investigating", "replayed"],
        default: "sent",
    },
    referencedDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
        default:null,
    },
    isDeleted: {
        type: Boolean,
        default: false
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


export default model('tickets', TicketSchema);