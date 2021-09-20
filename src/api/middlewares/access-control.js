import OperationalError, {
    NOT_AUTHORIZED_ERROR,
    NOT_FOUND_ERROR
} from "../validations/operational-error";

import Permission from "../../models/permission";
import Role from "../../models/role";
const debug = require("debug")("app:dev");

export function checkAccessControl(accessTitle) {
    return async function (req, res, next) {
        const access = await Permission.findOne({
            title: accessTitle,
            isDeleted: false
        });
        if (!access) return next(new OperationalError(NOT_FOUND_ERROR, accessTitle));
        debug("access", access.title);
        const role = await Role.findOne({
            _id: req.user.role,
            isDeleted: false
        });
        let url = req.protocol + '://' + req.get('host') + req.originalUrl;
        if (!role) return next(new OperationalError(NOT_FOUND_ERROR, "role"));
        debug("role", role.title);
        let permissions = role.permissions;
        if (!permissions.includes(access._id))
            return next(new OperationalError(NOT_FOUND_ERROR, "permission"));
        if (permissions.includes(access._id))
            debug("Access found.")
        debug("[Access OK] at: ", url)
        next();
    }
}