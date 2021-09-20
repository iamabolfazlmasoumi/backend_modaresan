import {model, Schema} from 'mongoose';


// Create Schema 
const CountrySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    phoneCode: {
        type: String,
        required: true,
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


export default model('countries', CountrySchema);
