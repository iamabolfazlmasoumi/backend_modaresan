import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const showExaminationValidation = validate([
    param('id').isMongoId(),
])


export const showBookletValidation = validate([
    param('id').isMongoId(),
])


export const completeExaminationStepValidation = validate([
    param('id').isMongoId(),
])


export const createAnswerSheetValidation = validate([
    param('id').isMongoId(),
])


export const editAnswerSheetValidation = validate([
    param('id').isMongoId(),
    body('question').exists(),
    body('option').exists(),
])
