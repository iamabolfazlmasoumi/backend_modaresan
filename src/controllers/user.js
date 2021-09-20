import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
// import redis from "redis";
import { } from 'dotenv/config'
// validations
import User from "../models/user";
import OperationalError, {
    NOT_AUTHORIZED_ERROR,
    NOT_FOUND_ERROR,
    WRONG_CREDENTIALS_ERROR,
} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";

// models


const secretKey = process.env.SECRET_KEY;
const debug = require("debug")("app:dev");
// const redisClient = redis.createClient(process.env.REDIS_PORT);

const userController = {
    usersList: async function (req, res, next) {
        try {

            let users = await User.find({
                isDeleted: false,
                isActivated: true,
            }).populate("role");
            return res.status(200).json(users);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showUser: async function (req, res, next) {
        try {
            let user = await User.findOne({
                isDeleted: false,
                isActivated: true,
            }).populate("role");
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            } else {
                // redisClient.setex(req.params.id, 3600, JSON.stringify(user));
                return res.status(200).json(user);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editUser: async function (req, res, next) {
        try {
            const {
                birthDate,
                postalCode,
                address,
                telegram,
                instagram,
                whatsapp,
                linkedin,
                skills,
                province,
                city,
                email,
            } = req.body;
            let user = await User.findOne({
                _id: req.params.id,
                isDeleted: false,
                isActivated: true,
            });
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            } else {
                if (birthDate == null) {
                    if (email == user.email) {
                        let updatedUser = await User.updateOne(
                            { _id: req.params.id, isDeleted: false, isActivated: true },
                            {
                                birthDate: birthDate,
                                postalCode: postalCode,
                                address: address,
                                telegram: telegram,
                                instagram: instagram,
                                whatsapp: whatsapp,
                                linkedin: linkedin,
                                skills: skills,
                                province: province,
                                city: city,
                                updatedAt: Date.now(),
                            }
                        );
                        return res.status(200).json(updatedUser);
                    } else {
                        let updatedUser = await User.updateOne(
                            { _id: req.params.id, isDeleted: false, isActivated: true },
                            {
                                birthDate: birthDate,
                                email: email,
                                isEmailActive: false,
                                postalCode: postalCode,
                                address: address,
                                telegram: telegram,
                                instagram: instagram,
                                whatsapp: whatsapp,
                                linkedin: linkedin,
                                skills: skills,
                                province: province,
                                city: city,
                                updatedAt: Date.now(),
                            }
                        );
                        //we Send Activation Email
                        return res.status(200).json(updatedUser);
                    }
                } else {
                    if (email == user.email) {
                        let updatedUser = await User.updateOne(
                            { _id: req.params.id, isDeleted: false, isActivated: true },
                            {
                                postalCode: postalCode,
                                address: address,
                                telegram: telegram,
                                instagram: instagram,
                                whatsapp: whatsapp,
                                linkedin: linkedin,
                                skills: skills,
                                province: province,
                                city: city,
                                updatedAt: Date.now(),
                            }
                        );
                        return res.status(200).json(updatedUser);
                    } else {
                        let updatedUser = await User.updateOne(
                            { _id: req.params.id, isDeleted: false, isActivated: true },
                            {
                                email: req.body.email,
                                isEmailActive: false,
                                postalCode: postalCode,
                                address: address,
                                telegram: telegram,
                                instagram: instagram,
                                whatsapp: whatsapp,
                                linkedin: linkedin,
                                skills: skills,
                                province: province,
                                city: city,
                                updatedAt: Date.now(),
                            }
                        );
                        // We must send Email Activation Link
                        return res.status(200).json(updatedUser);
                    }
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editMobileRequest: async function ( req, res, next ) {
        try {
            const { mobile, password } = req.body;
            let user = await User.findOne({
                _id: req.params.id,
                isDeleted: false,
                isActivated: true,
            });
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            } else {
                let isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    let updatedUser = await User.updateOne(
                            { _id: req.params.id, isDeleted: false, isActivated: true },
                            {
                                mobile: mobile,
                                isActivated: true,
                                activationCode: randomstring.generate({
                                    length: 6,
                                    charset: "numeric",
                                }),
                                updatedAt: Date.now(),
                                
                            }
                    );

                    // now after update we must send this activationCode
                    return res.status( 200 ).json( updatedUser );
                } else {
                    return res.status(400).json({ error: "کلمه عبور نادرست است." });
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editMobileVerify: async function (req, res, next) {
        try {
            const { activationCode , mobile} = req.body;
            let user = await User.findOne({
                _id: req.params.id,
                isDeleted: false,
                isActivated: true,
            });
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            } else {
                if (activationCode == user.activationCode) {
                        let updatedUser = await User.updateOne(
                            { _id: req.params.id, isDeleted: false, isActivated: true },
                            {
                                mobile: mobile,
                                isActivated: true,
                                activationCode: randomstring.generate({
                                    length: 6,
                                    charset: "numeric",
                                }),
                                updatedAt: Date.now(),
                            }
                        );
                        return res.status(200).json(updatedUser);
                    } else {
                        return next(new OperationalError(WRONG_CREDENTIALS_ERROR, ""));
                    }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    changePassword: async function (req, res, next) {
        try {
            let user = await User.findOne({
                _id: req.params.id,
                isDeleted: false,
                isActivated: true,
            });
            //console.log(user)
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            } else {
                const currentPassword = req.body.currentPassword;
                let isMatch = bcrypt.compareSync(currentPassword, user.password);
                //console.log(isMatch)
                if (isMatch) {
                    let salt = await bcrypt.genSalt(12);
                    let hash = bcrypt.hashSync(req.body.newPassword, salt);
                    console.log("hash", hash);
                    let updatedUser = await User.updateOne(
                        { _id: req.params.id, isDeleted: false, isActivated: true },
                        {
                            password: hash,
                        }
                    );
                    //console.log(updatedUser)
                    const payload = {
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        mobile: updatedUser.mobile,
                        nationalCode: updatedUser.nationalCode,
                    }; // Creating jwt payload
                    jwt.sign(payload, secretKey, { expiresIn: "7d" }, (err, token) => {
                        res.json({
                            success: true,
                            firstName: payload.firstName,
                            lastName: payload.lastName,
                            mobile: payload.mobile,
                            nationalCode: payload.nationalCode,
                            token: "Bearer " + token,
                        });
                    });
                    return res.status(200).json(updatedUser);
                } else {
                    return next(new OperationalError(WRONG_CREDENTIALS_ERROR, ""));
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editAccountSecurity:async function(req, res) {
        try
        {
            const { googleAuthenticator, smsNewsletter, emailNewsletter, loginSms} = req.body;
        let user = await User.findOne({_id:req.user.id, isDeleted:false});
        if (!user) {
            return next(new OperationalError(NOT_FOUND_ERROR, "user"));
        } else{
          let updatedUser = await user.updateOne({_id:req.user.id, isDeleted:false}, {
            googleAuthenticator: googleAuthenticator,
            smsNewsletter: smsNewsletter,
            emailNewsletter: emailNewsletter,
            loginSms: loginSms,
          });
          return res.json(updatedUser);
        }
        } catch ( err )
        {
            return next(new ProgrammingError(err.message, err.stack));
      }
    },
    assignRoleToUser: async function (req, res, next) {
        try {
            let user = await User.findOne({ _id: req.params.id, isDeleted: false });
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            }
            let isMatch = await bcrypt.compare(req.body.password, user.password);
            debug("isMatch", isMatch);
            if (isMatch) {
                let updatedUSer = await User.updateOne(
                    { _id: req.params.id, isDeleted: false },
                    {
                        role: req.body.role,
                    }
                );
                return res.status(200).json(updatedUSer);
            } else {
                return next(new OperationalError(NOT_AUTHORIZED_ERROR, "password"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getUserInformation: async(req, res, next) => {
        try {
            let user= await User.findOne({_id:req.user.id}).populate('province').populate('city').populate('skills');
            return res.status(200).json(user);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));

        }
    }
};

export default userController;
