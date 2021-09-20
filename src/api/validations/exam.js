import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const createExamValidation = validate([
    body("title").isLength({max: 200}),
    body("bookletNumber").isNumeric(),
    body("isPdfVersion").isBoolean().toBoolean(),
]);

export const getExamValidation = validate([param("id").isMongoId()]);

export const createBookletValidation = validate([
    body("title").isLength({max: 200}),
]);

export const getExamBookletValidation = validate([param("id").isMongoId()]);

export const createExamProductionValidation = validate([
    param("id").isMongoId(),
]);

export const getExamProductionValidation = validate([param("id").isMongoId()]);

export const createExamPublishValidation = validate([param("id").isMongoId()]);

export const getExamPublishValidation = validate([param("id").isMongoId()]);

export const createExamFactorValidation = validate([param("id").isMongoId()]);

export const getExamFactorValidation = validate([param("id").isMongoId()]);

export const createExamBasicValidation = validate([param("id").isMongoId()]);

export const setToCompletedExamProcedureValidation = validate([
    param("id").isMongoId(),
]);
