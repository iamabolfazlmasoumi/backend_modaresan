import {validate} from "../middlewares/validation";
import {body} from "express-validator";

export const createFiscalYearValidation = validate([
    body('title').isString(),
])
