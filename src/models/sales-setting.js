import mongoose, {model, Schema} from 'mongoose';


// Create Schema 
const SalesSettingSchema = new Schema({
    PricePerAttendant: {
        type: Number,
        default: 0
    },
    PricePerQuestion: {
        type: Number,
        default: 0

    },
    ConstantPrice: {
        type: Number,
        default: 0
    },
    SystemSalesPortion: {
        type: Number,
        default: 20
    },
    TotalDiscount: {
        type: Number,
        default: 0
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
    fiscalYear:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "fiscal-years",
        },
   type: {
        type: String,
        enum: ["exam", "webinar", "course"],
        default: null,
    },
});


export default model('sales-settings', SalesSettingSchema);