import {body, check, param} from 'express-validator'
import {validate} from "../middlewares/validation";


export const createBookletValidation = validate([
    param('id').isMongoId(),
    body('lesson').isMongoId(),
    check('seasons.*').isMongoId(),
    check('topics.*').isMongoId(),
    body('factor').isString(),
    body('questionCount').isNumeric(),
    body('time').isNumeric(),
])


export const getBookletValidation = validate([
    param('id').isMongoId(),
])
