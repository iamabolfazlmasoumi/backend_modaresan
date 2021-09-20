// validations
// models
import User from "../models/user";
import Department from "../models/department";

import OperationalError, {
    ALREADY_EXISTS_ERROR,
    INVALID_OPERATION_ERROR,
    NOT_AUTHORIZED_ERROR,
} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";
import Permission from "../models/permission";
import Role from "../models/role";

const departmentController = {
    createDepartment: async function (req, res, next) {
        try {
            const {
                title,
                code
            } = req.body;
            let dep = await Department.findOne({
                title: title,
                isDeleted: false
            });
            if (!dep) {
                let newDep = await new Department({
                    title: title,
                    code: code,
                });
                await newDep.save();
                return res.status(200).json(newDep);
            } else {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "department"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    departmentList: async function (req, res, next) {
        try {
            const access = await Permission.findOne({
                title: "admin:get_department_list"
            });
            if (!access) return next(new OperationalError(NOT_FOUND_ERROR, "access"));
            const role = await Role.findOne({
                _id: req.user.role,
                isDeleted: false
            });
            if (!role) return next(new OperationalError(NOT_FOUND_ERROR, "role"));
            if (!role.permissions.includes(access._id)) {
                return next(new OperationalError(NOT_AUTHORIZED_ERROR, "departmentList"));
            }
            let deps = await Department.find({
                isDeleted: false
            });
            return res.status(200).json(deps);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getUsersOfDepartment: async function (req, res, next) {
        try {
            let depUsers = await User.find({
                department: req.params.id,
                isDeleted: false,
            });
            return res.status(200).json(depUsers);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    assignHR: async function (req, res, next) {
        try {
            let dep = await Department.findOne({isDeleted: false, _id: req.body.department});
            let depsCount = await Department.find({isDeleted: false}).count();
            if (dep.capacity < depsCount) {
                let updatedUser = await User.updateOne({
                    _id: req.params.id,
                    isDeleted: false,
                }, {
                    department: req.body.department
                });
                return res.status(200).json(updatedUser);
            } else {
                return next(
                    new OperationalError(INVALID_OPERATION_ERROR, "department")
                );
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    unassignHR: async function (req, res, next) {
        try {

            let updatedUser = await User.updateOne({
                _id: req.params.id,
                isDeleted: false,
            }, {
                department: null
            });
            return res.status(200).json(updatedUser);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    HRList: async function (req, res, next) {
        try {
            let depUsers = await User.find({isDeleted: false, department: !null});

            return res.status(200).json(depUsers);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getDepartments: async function (req, res, next) {
        try {
            let departments = await Department.find({
                isDeleted: false
            });
            return res.status(200).json(departments);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
};

export default departmentController;