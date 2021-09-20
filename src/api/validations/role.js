import {validate} from "../middlewares/validation";
import {body, check, param} from "express-validator";

export const createRoleValidation = validate([
    body('title').isString(),
    check('permissions.*').isMongoId(),
    check('branches.*').isMongoId(),
    check('subBranches.*').isMongoId(),
    check('groups.*').isMongoId(),
    check('subGroups.*').isMongoId(),
    check('countries.*').isMongoId(),
    check('provinces.*').isMongoId(),
    check('cities.*').isMongoId(),
])


export const getRoleValidation = validate([
    param('id').isMongoId(),

])


export const updateRoleValidation = validate([
    param('id').isMongoId(),
    body('title').isString(),
    check('permissions.*').isMongoId(),
    check('branches.*').isMongoId(),
    check('subBranches.*').isMongoId(),
    check('groups.*').isMongoId(),
    check('subGroups.*').isMongoId(),
    check('countries.*').isMongoId(),
    check('provinces.*').isMongoId(),
    check('cities.*').isMongoId(),
])
