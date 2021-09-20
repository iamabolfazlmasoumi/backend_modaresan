import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const createExamBasicRequestValidation = validate([
    body('withCertificate').isBoolean(),
    body('withNegativePoint').isBoolean(),
    // body('organization').isLength({max: 200}),
    // body('organizationCode').isString(),
    body('referenceFile').isString(),
    body('branch').isString(),
    body('subBranch').isString(),
    body('group').isString(),
    body('subGroup').isString(),
]);


export const getExamBasicRequestValidation = validate([
    param('id').isMongoId(),
]);


export const updateExamBasicRequestValidation = validate([
    body('withCertificateAccepted').isBoolean(),
    body('withCertificateMessage').isBoolean(),
    body('organizationAccepted').isBoolean(),
    body('organizationCodeAccepted').isBoolean(),
    body('referenceFileAccepted').isBoolean(),
    body('organizationMessage').isString(),
    body('organizationCodeMessage').isString(),
    body('referenceFileMessage').isString(),
]);


export const getExamBasicHistoryValidation = validate([
    param('id').isMongoId(),
]);


export const getExamBasicValidation = validate([
    param('id').isMongoId(),
]);

export const handleExamBasicStateValidation = validate([
    param('id').isMongoId(),
    // body('isAccepted').isBoolean(),
    // body('isRejected').isBoolean(),
]);


export const cloneExamBasicCollectionValidation = validate([
    param('id').isMongoId(),
]);