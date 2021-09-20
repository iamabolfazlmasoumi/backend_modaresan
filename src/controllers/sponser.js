// Validations
// Model
import Sponser from '../models/sponser';
import OperationalError, {NOT_FOUND_ERROR} from "../api/validations/operational-error";


const sponserController = {

    createSponser: async function (req, res, next) {
        try {
            const {name, phoneNumber, address, brandImage, city} = req.body;
            const newSponser = new Sponser({
                name: name,
                phoneNumber: phoneNumber,
                address: address,
                brandImage: brandImage,
                city: city,
                isAccepted: false,
            });
            await newSponser.save();
            return res.status(200).json(newSponser);
        } catch (err) {
            return next(new OperationalError(NOT_FOUND_ERROR, 'city'));
        }
    },
    sponsersList: async function (req, res, next) {
        try {
            let sponsers = await Sponser.find({isDeleted: false}).populate("city");
            if (sponsers) {
                return res.status(200).json(sponsers);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'sponser'));
            }
        } catch (err) {
            return next(new OperationalError(NOT_FOUND_ERROR, 'city'));
        }
    },
    showSponser: async function (req, res, next) {
        try {
            let sponser = await Sponser.findOne({_id: req.params.id, isDeleted: false}).populate("city");
            if (sponser) {
                return res.status(200).json(sponser);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'sponser'));
            }
        } catch (err) {
            return next(new OperationalError(NOT_FOUND_ERROR, 'city'));
        }
    },

    handleAcceptanceRequest: async function (req, res, next) {
        //
    },
    editSponser: async function (req, res, next) {
        try {
            let sponser = await Sponser.findOne({ isDeleted: false, _id: req.params.id });
            if (!sponser)
                return next(new OperationalError(NOT_FOUND_ERROR, 'sponser'));
            let updatedSponser = await Sponser.updateOne({
                isDeleted: false,
                _id:req.params.id
            }, {
                title: title,
            });
            return res.status(200).json(updatedSponser);
        } catch (err) {
            return next(new OperationalError(NOT_FOUND_ERROR, 'city'));
        }
    }

}

export default sponserController;