import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const createLessonValidation = validate([
    body('title').isString(),
    body('fiscalYear').isMongoId(),
    body('branch').isMongoId(),
    body('subBranch').isMongoId(),
    body('subGroup').isMongoId(),
])


export const getLessonValidation = validate([
    param('id').isMongoId(),
])


export const createSeasonValidation = validate([
    body('title').isString(),
    body('lesson').isMongoId(),
])


export const getSeasonValidation = validate([
    param('id').isMongoId(),
])


export const createTopicValidation = validate([
    body('title').isString(),
    body('season').isMongoId(),
])


export const getTopicValidation = validate([
    param('id').isMongoId(),

])


export const getTopicListValidation = validate([
    param('id').isMongoId(),

])


export const getSeasonListValidation = validate([
    param('id').isMongoId(),

])