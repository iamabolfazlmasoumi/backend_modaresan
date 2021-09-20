import {body} from 'express-validator'
import {validate} from "../middlewares/validation";

export const createBranchValidation = validate([
    body('title').isString().isLength({max: 50}),
])

export const createSubBranchValidation = validate([
    body('title').isString().isLength({max: 50}),
    body('branch').isMongoId(),
])

export const createGroupValidation = validate([
    body('title').isString().isLength({max: 50}),
    body('subBranch').isMongoId(),
])

export const createSubGroupValidation = validate([
    body('title').isString().isLength({max: 50}),
    body('group').isMongoId(),
])


export const createCityValidation = validate([
    body('title').isString().isLength({max: 50}),
    body('province').isString().matches(/^[a-f\d]{24}$/i)
])