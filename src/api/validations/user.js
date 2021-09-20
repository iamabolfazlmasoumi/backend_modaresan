import {validate} from "../middlewares/validation";
import {body, param} from "express-validator";

export const showUserValidator = validate([
    param('id').isMongoId(),
])


export const editUserValidator = validate([
    param('id').isMongoId(),
    body('email').isEmail().normalizeEmail(),
    body('birthDate').isDate().toDate(),
    body('address').isString().bail().isLength({max: 200}),
    body('province').isMongoId(),
    body('city').isMongoId(),
    body('skills').isArray(),
    body('telegram').isString().bail().isLength({max: 50}),
    body('instagram').isString().bail().isLength({max: 50}),
    body('linkedin').isString().bail().isLength({max: 70}),
    body('whatsapp').isString().bail().isLength({max: 50}),
    body('postalCode').isPostalCode('IR'),
])


export const editMobileVerifyValidator = validate([
    param('id').isMongoId(),
    body('mobile').isMobilePhone('fa-IR'),

])


export const editMobileRequestValidator = validate( [
     param('id').isMongoId(),
    body('mobile').isMobilePhone('fa-IR'),
    body('password').isStrongPassword({minLength: 8, minNumbers: 1, minSymbols: 1}),

])

export const changePasswordValidator = validate([
    param('id').isMongoId(),
    body('newPassword').isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 0
    }),
    body('newPassword2').custom((value, {req}) => req.newPassword === req.newPassword2)
])
