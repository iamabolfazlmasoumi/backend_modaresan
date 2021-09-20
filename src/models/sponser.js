import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const SponserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,

    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cities",
        required: true
    },
    address: {
        type: String,
        required: true,

    },
    brandImage: {
        type: String,
        default: 'no_image.png'

    },
    isAccepted: {
        type: Boolean,
        default: false,

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


export default model('sponsers', SponserSchema);