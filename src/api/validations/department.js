import {body, param} from 'express-validator'
import {validate} from "../middlewares/validation";

export const createDepartmentValidator= validate([
    body('title').isString().isLength({max: 50}),
    body('code').isString().isLength({max: 50}),
])

export const getDepartmentUsersValidator = validate([
    param('id').isMongoId(),
])



