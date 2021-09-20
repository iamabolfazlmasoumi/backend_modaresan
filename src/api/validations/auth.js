import {body} from 'express-validator'
import {validate} from "../middlewares/validation";

export const signInValidation = validate([
    body('mobile').isMobilePhone("fa-IR"),
    body('password').isLength({max: 50}),
])


export const registryValidation = validate([
    body('lastName').isString().bail().isLength({max: 50}),
    body('firstName').isString().bail().isLength({max: 50}),
    body('mobile').isMobilePhone("fa-IR"),
    body('nationalCode').matches(/^\d{10}$/i),
    body('password').isLength({max: 100})
])


export const signupVerificationValidation = validate([
        body('activationCode').isNumeric(),
    ]
)