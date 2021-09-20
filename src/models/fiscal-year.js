import {model, Schema} from 'mongoose';


// Create Schema 
const YearSchema = new Schema({
    title: {
        type: Number,
        required: true

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


export default model('fiscal-years', YearSchema);