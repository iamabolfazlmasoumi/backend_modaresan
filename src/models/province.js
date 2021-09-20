import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const ProvinceSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    phoneCode: {
        type: String,
        required: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "countries",
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


export default model('provinces', ProvinceSchema);
