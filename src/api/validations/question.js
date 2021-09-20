import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const getQuestionValidation = validate([
    param('id').isMongoId(),
]);


export const createAnswerValidation = validate([
    param('id').isMongoId(),
    body('text').isLength({max: 200}),
    body('image').isString(),
]);


export const getAnswerValidation = validate([
    param('id').isMongoId(),
]);


export const createOptionValidation = validate([
    param('id').isMongoId(),
    body('text').isLength({max: 200}),
    body('image').isString(),
    body('isCorrect').isBoolean()
]);


export const getOptionValidation = validate([
    param('id').isMongoId(),
]);
export const addQuestionToBankValidation = validate([
    param('id').isMongoId(),
]);
export const addOptionToQuestionValidation = validate([
    param('id').isMongoId(),
    body('text').isLength({max: 300}),
    body('image').isString(),
    body('point').isNumeric(),
]);