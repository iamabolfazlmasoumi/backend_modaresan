import {body} from 'express-validator'
import {validate} from "../middlewares/validation";

export const createCountryValidation = validate([
    body('title').isString().isLength({max: 50}),
    body('phoneCode').isString()
]);
export const createProvinceValidation = validate([
    body('title').isString().isLength({max: 50}),
    body('phoneCode').isString()
])


export const createCityValidation = validate([
    body('title').isString().isLength({max: 50}),
    body('province').isString().bail().matches(/^[a-f\d]{24}$/i)
])