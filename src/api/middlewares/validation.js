import {validationResult} from "express-validator";
import OperationalError, {REQUIRED_FIELD_ERROR} from "../validations/operational-error";

// Validates received requests and checks for required fields and their format.
export const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty())
            return next()
        else {
            return next(new OperationalError(REQUIRED_FIELD_ERROR, formatError(errors)))
        }

    };
};


const formatError = (errors) => errors.array().map(error => {
    if (error.msg === 'Invalid value') {
        return error.param
    }
}).join(',')