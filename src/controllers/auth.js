import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
// validations
// models
import User from "../models/user";
import OperationalError, {
    ACCOUNT_SUSPENDED_ERROR,
    ALREADY_EXISTS_ERROR,
    NOT_FOUND_ERROR,
    WRONG_CREDENTIALS_ERROR,
} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";

const secretKey = process.env.SECRET_KEY;

const authController = {
    signup: async function (req, res, next) {
        try {
            const {mobile, nationalCode, firstName, lastName, password, password2} =
                req.body;
            let findUserByMobile = await User.findOne({
                mobile: mobile,
                isDeleted: false,
            });
            if (findUserByMobile) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "mobile"));
            }
            let findUserBynationalCode = await User.findOne({
                nationalCode: nationalCode,
                isDeleted: false,
            });
            if (findUserBynationalCode) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "nationalCode"));
            }
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(password, salt);
            const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                mobile: mobile,
                nationalCode: nationalCode,
                password: hash,
                activationCode: randomstring.generate({
                    length: 6,
                    charset: "numeric",
                }),
                role: null,
            });
            await newUser.save();
            const payload = {mobile: newUser.mobile}; // Creating jwt payload
            jwt.sign(payload, secretKey, {expiresIn: 3600}, (err, token) => {
                res.json({
                    success: true,
                    mobile: payload.mobile,
                    token: "Bearer " + token,
                });
            });
            // return res.status(200).json(newUser);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    verifyUserSignUp: async function (req, res, next) {
        try {
            const {activationCode, mobile} = req.body;
            // mobile must defined in payload with in user signup request, so the payload is loaded with mobile number before.
            let user = await User.findOne({
                activationCode: activationCode,
                mobile: mobile,
                isActivated: false,
                isDeleted: false,
            });
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "mobile"));
            } else {
                if (!user.isActivated) {
                    await User.updateOne(
                        {
                            activationCode: activationCode,
                            mobile: mobile,
                            isActivated: false,
                            isDeleted: false,
                        },
                        {
                            isActivated: true,
                            updatedAt: Date.now(),
                            // todo must generate unique random code
                            activationCode: randomstring.generate({
                                length: 6,
                                charset: "numeric",
                            }),
                        }
                    );
                    return res
                        .status(200)
                        .json({message: "حساب کاربری با موفقیت فعالسازی شد."});
                } else {
                    return next(new OperationalError(ALREADY_EXISTS_ERROR, "mobile"));
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    signin: async function (req, res, next) {
        try {
            const {mobile, password} = req.body;
            // Find User by mobile
            let user = await User.findOne({
                mobile: mobile,
                isDeleted: false,
                isActivated: true,
            });
            if (user) {
                let isMatch = await bcrypt.compare(password, user.password);
                if (user.lastFailedSigninTry != null) {
                    if (user.failedTries == 5) {
                        if ((Date.now() - user.lastFailedSigninTry) / 3600 / 24 > 20) {
                            if (isMatch) {
                                await User.updateOne(
                                    {mobile: mobile, isActivated: true, isDeleted: false},
                                    {
                                        failedTries: 0,
                                        lastFailedSigninTry: null,
                                    }
                                );
                                // User Matched
                                const payload = {
                                    id: user._id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role,
                                }; // Creating jwt payload
                                // Sign Token
                                jwt.sign(
                                    payload,
                                    secretKey,
                                    {expiresIn: "7d"},
                                    (err, token) => {
                                        res.json({
                                            success: true,
                                            token: "Bearer " + token,
                                        });
                                    }
                                );
                                //return res.status(200).json({message: "عملیات ورود با موفقیت انجام شد."});
                            } else {
                                await User.updateOne(
                                    {mobile: mobile, isActivated: true, isDeleted: false},
                                    {
                                        failedTries: 1,
                                        lastFailedSigninTry: Date.now(),
                                    }
                                );

                                return next(new OperationalError(WRONG_CREDENTIALS_ERROR, ""));
                            }
                        } else {
                            return next(new OperationalError(ACCOUNT_SUSPENDED_ERROR, ""));
                        }
                    }
                    if (user.failedTries == 4) {
                        if (isMatch) {
                            await User.updateOne(
                                {mobile: mobile, isActivated: true, isDeleted: false},
                                {
                                    failedTries: 0,
                                    lastFailedSigninTry: null,
                                }
                            );
                            // User Matched
                            const payload = {
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                            }; // Creating jwt payload
                            // Sign Token
                            jwt.sign(
                                payload,
                                secretKey,
                                {expiresIn: "7d"},
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token,
                                    });
                                }
                            );
                            //return res.status(200).json({message: "عملیات ورود با موفقیت انجام شد."});
                        } else {
                            await User.updateOne(
                                {mobile: mobile, isActivated: true, isDeleted: false},
                                {
                                    failedTries: 5,
                                    lastFailedSigninTry: Date.now(),
                                }
                            );
                            return next(
                                new OperationalError(ACCOUNT_SUSPENDED_ERROR, "20min")
                            );
                        }
                    }
                    if (user.failedTries < 4) {
                        if (isMatch) {
                            await User.updateOne(
                                {mobile: mobile, isActivated: true, isDeleted: false},
                                {
                                    failedTries: 0,
                                    lastFailedSigninTry: null,
                                }
                            );
                            // User Matched
                            const payload = {
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                            }; // Creating jwt payload
                            // Sign Token
                            jwt.sign(
                                payload,
                                secretKey,
                                {expiresIn: "7d"},
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token,
                                    });
                                }
                            );
                            //return res.status(200).json({message: "عملیات ورود با موفقیت انجام شد."});
                        } else {
                            await User.updateOne(
                                {mobile: mobile, isActivated: true, isDeleted: false},
                                {
                                    failedTries: user.failedTries + 1,
                                    lastFailedSigninTry: Date.now(),
                                }
                            );
                            return next(new OperationalError(WRONG_CREDENTIALS_ERROR, ""));
                        }
                    }
                } else {
                    if (isMatch) {
                        await User.updateOne(
                            {mobile: mobile, isActivated: true, isDeleted: false},
                            {
                                failedTries: 0,
                                lastFailedSigninTry: null,
                            }
                        );
                        // User Matched
                        const payload = {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                        }; // Creating jwt payload
                        // Sign Token
                        jwt.sign(payload, secretKey, {expiresIn: "7d"}, (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token,
                            });
                        });

                        //return res.status(200).json({message: "عملیات ورود با موفقیت انجام شد."});
                    } else {
                        await User.updateOne(
                            {mobile: mobile, isActivated: true, isDeleted: false},
                            {
                                failedTries: 1,
                                lastFailedSigninTry: Date.now(),
                            }
                        );
                        return next(new OperationalError(ACCOUNT_SUSPENDED_ERROR, ""));
                    }
                }
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    sendActivationCode: async function (req, res) {
        // Send Activation code api via sms
    },
    forgotPassword: async function (req, res) {
        //
    },
};

export default authController;
