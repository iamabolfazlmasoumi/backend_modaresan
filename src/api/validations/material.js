import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const createMaterialValidation = validate([
    param('id').isMongoId(),
    body('bankQuestionsCount').isNumeric().default(0),
    // body('isRandomSelection').isBoolean(),
    body('hardQuestionsCount').isNumeric().default(0),
    body('simpleQuestionsCount').isNumeric().default(0),
    body('privateQuestionsCount').isNumeric().default(0),
])


export const getQuestionBankValidation = validate([
    param('id').isMongoId(),
])


export const updateQuestionBankValidation = validate([
    param('id').isMongoId(),
    body('question').isMongoId(),
])


export const getRandomQuestionValidation = validate([
    param('id').isMongoId(),
])


export const createQuestionValidation = validate([
    param('id').isMongoId(),
    body('text').isString(),
    body('type').isNumeric(),
    body('difficulty').isString(),
    body('resource').isString(),
    body('season').isMongoId(),
    body('topic').isMongoId(),
    body('fiscalYear').isMongoId(),
    body('image').isString(),
])
