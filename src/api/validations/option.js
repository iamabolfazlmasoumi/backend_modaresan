import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const createTextbookValidation = validate([
    param('id').isMongoId(),
    body('text').isLength({max: 50}),
    body('question').isMongoId(),
    body('image').exists(),
])


export const getTextbookValidation = validate([
    param('id').isMongoId(),
])