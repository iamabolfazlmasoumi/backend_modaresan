import mongoose from 'mongoose';
import {
    model,
    Schema
} from 'mongoose';


// Create Schema 
const ScheduleSchema = new Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
     date: {
            type: String,
            default: null,
        },
    startTime: {
            type: Date,
            default: null
        },
        endTime: {
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


export default model('schedules', ScheduleSchema);