// validations
// models
import Role from "../models/role";
import OperationalError, {ALREADY_EXISTS_ERROR, NOT_FOUND_ERROR,} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";

const roleController = {
    createRole: async function (req, res, next) {
        try {
            let oldRole = await Role.findOne({
                title: req.body.title,
                isDeleted: false,
            });
            if (oldRole) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "role"));
            }
            const {
                title,
                permissions,
                branches,
                subBranches,
                groups,
                subGroups,
                cities,
                department,
            } = req.body;
            const newRole = new Role({
                title: title,
                permissions: permissions,
                groups: groups,
                cities: cities,
                department: department,
                isDeleted: false,
            });
            await newRole.save();
            return res.status(200).json(newRole);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    rolesList: async function (req, res, next) {
        try {
            let roles = await Role.find({
                isDeleted: false
            })
                .populate("permissions")
                .populate("groups")
                .populate("cities");
            return res.status(200).json(roles);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showRole: async function (req, res, next) {
        try {
            let oldRole = await Role.findOne({
                _id: req.params.id,
                isDeleted: false
            })
                .populate("permissions")
                .populate("branches")
                .populate("subBranches")
                .populate("groups")
                .populate("subGroups")
                .populate("countries")
                .populate("provinces")
                .populate("cities");
            if (oldRole) {
                return res.status(200).json(oldRole);
            } else {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "role"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editRole: async function (req, res, next) {
        try {
            let oldRole = await Role.findOne({
                _id: req.params.id,
                isDeleted: false,
            });
            if (!oldRole) {
                return next(new OperationalError(NOT_FOUND_ERROR, "role"));
            } else {
                const {
                    title,
                    permissions,
                    groups,
                    cities,
                } = req.body;
                let updatedRole = await Role.updateOne({
                    _id: req.params.id,
                    isDeleted: false
                }, {
                    title: title,
                    permissions: permissions,
                    groups: groups,
                    cities: cities,
                    isDeleted: false,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(updatedRole);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
};

export default roleController;