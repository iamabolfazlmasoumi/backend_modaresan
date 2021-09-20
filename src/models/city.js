import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const CitySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "provinces",
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


export default model('cities', CitySchema);