import mongoose from 'mongoose';
import {
    model,
    Schema
} from 'mongoose';


// Create Schema 
const TicketConversationSchema = new Schema({
    body: {
        type: String,
        required: true,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tickets"
    },
    file: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    isReplayed: {
        type: Boolean,
        default: false,
    },
    replayedUser: {
        type: Date,
        default: Date.now
    },
    replayedAt: {
        type: Date,
        default: null
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


export default model('ticket-conversatiopns', TicketConversationSchema);