import {validate} from "../middlewares/validation";
import { body, param } from "express-validator";

export const assignHRValidator = validate([
    param('id').isMongoId(),
    body('department').isMongoId(),
])


export const unAssignHRValidator = validate([
    param('id').isMongoId(),
])