import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const createSponserValidation = validate([
    body('name').isString().bail().isLength({max: 100}),
    body('phoneNumber').isString(),
    body('address').isString(),
    body('brandImage').isString(),
    body('city').isMongoId()
]);


export const getSponserValidation = validate([
    param('id').isMongoId(),
]);


export const updateSponserValidation = validate([
    param('id').isMongoId(),
    body('name').isString().bail().isLength({max: 100}),
    body('phoneNumber').isString(),
    body('address').isString(),
    body('brandImage').isString(),
    body('city').isMongoId()
]);