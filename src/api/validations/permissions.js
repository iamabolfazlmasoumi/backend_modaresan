import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const createPermissionValidation = validate([
    body('title').isString(),
    body('description').isString(),
    body('code').isString(),
    body('url').isString(),
])


export const getPermissionValidation = validate([
    param('id').isMongoId(),
])


export const updatePermissionValidation = validate([
    param('id').isMongoId(),
    body('title').isString(),
    body('description').isString(),
    body('code').isString(),
    body('url').isString(),
])




