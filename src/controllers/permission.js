// Validations
// Models
import Permission from '../models/permission';
import OperationalError, {ALREADY_EXISTS_ERROR, NOT_FOUND_ERROR} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";

const permissionController = {

    createPermission: async function (req, res, next) {
        try {
            const {
                title,
                description,
                code,
                url
            } = req.body;

            let permission = await Permission.findOne({
                title: title,
                isDeleted: false
            });
            if (permission) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'permission'));

            }
            const newPermission = new Permission({
                title: title,
                description: description,
                code: code,
                url: url,
            });
            await newPermission.save();
            return res.status(200).json(newPermission);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    showPermission: async function (req, res, next) {
        try {
            let permission = await Permission.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (permission) {
                return res.status(200).json(permission);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'permission'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    permissionsList: async function (req, res, next) {
        try {
            let permissions = await Permission.find({
                isDeleted: false
            });
            return res.status(200).json(permissions);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editPermission: async function (req, res, next) {
        try {
            const {
                title,
                description,
                code,
                url
            } = req.body;
            let permission = await Permission.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!permission) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'permission'));
            } else {
                let updatedPermission = await Permission.updateOne({
                    _id: req.params.id,
                    isDeleted: false
                }, {
                    title: title,
                    description: description,
                    isDeleted: false,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(updatedPermission);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

}

export default permissionController;