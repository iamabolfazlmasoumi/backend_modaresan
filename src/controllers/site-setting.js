// Validations

// Models
import Setting from '../models/site-setting';
import ProgrammingError from "../api/validations/programmer-error";
import OperationalError, { NOT_FOUND_ERROR } from "../api/validations/operational-error";

const siteSettingController = {

    handleGeneralSetting: async function (req, res, next) {
        try {
            let settingCollectionCount = await Setting.find({ isDeleted: false }).countDocuments();
            const {
                siteTitle,
                mainDescription,
                secondDescription,
                keywords,
                logo,
                icon,
                updatingStatus,
                updatingStatusText,
                footerDescription,
                copyright,
                tel1,
                tel2,
                tel3,
                address,
                email,
                telegram,
                instagram,
                linkedin,
                whatsapp,


            } = req.body;
            if (settingCollectionCount == 0) {
                const newSetting = new Setting({
                    index: 0,
                    siteTitle: siteTitle,
                    mainDescription: mainDescription,
                    secondDescription: secondDescription,
                    keywords: keywords,
                    logo: logo,
                    icon: icon,
                    updatingStatus: false,
                    updatingStatusText: null,
                    footerDescription: footerDescription,
                    copyright: copyright,
                    tel1: tel1,
                    tel2: tel2,
                    tel3: tel3,
                    address: address,
                    email: email,
                    telegram: telegram,
                    instagram: instagram,
                    whatsapp: whatsapp,
                    linkedin: linkedin,
                    examCategories: [],
                    courseCategories: [],
                    webinarCategories: [],
                });
                await newSetting.save();
                return res.status(200).json(newSetting);

            } else {
                let newSetting = await Setting.updateOne({ index: 0, isDeleted: false }, {
                    index: 0,
                    siteTitle: siteTitle,
                    mainDescription: mainDescription,
                    secondDescription: secondDescription,
                    keywords: keywords,
                    logo: logo,
                    icon: icon,
                    footerDescription: footerDescription,
                    copyright: copyright,
                    tel1: tel1,
                    tel2: tel2,
                    tel3: tel3,
                    address: address,
                    email: email,
                    telegram: telegram,
                    instagram: instagram,
                    whatsapp: whatsapp,
                    linkedin: linkedin,
                });
                return res.status(200).json(newSetting);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },


    showGeneralSetting: async function (req, res, next) {
        try {
            let setting = await Setting.findOne({ index: 0, isDeleted: false }).select('-index').exec();
            return res.status(200).json(setting);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    handleSiteOnUpdatingStatus: async function (req, res, next) {
        // To do all Routes must be redirected to the updating status route except login and super admin controls
    },
    putSiteOnUpdatingStatus: async function (req, res, next) {
        try {
            let setting = await Setting.findOne({ index: 0, isDeleted: false });
            if (setting) {
                let newSetting = await Setting.updateOne({ index: 0, isDeleted: false }, {
                    updatingStatus: true,
                    updatingStatusText: updatingStatusText,
                });
                return res.status(200).json(newSetting);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'city'));
            }

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createExamCategoryForIndex: async function (req, res, next) {
        try {
            const { examCategories } = req.body
            let siteSetting = await Setting.updateOne({ index: 0, isDeleted: false }, {
                examCategories: examCategories,
            });
            return res.status(200).json(siteSetting)

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamCategoryForIndex: async function (req, res, next) {
        try {
            let siteSetting = await Setting.findOne({ index: 0, isDeleted: false }).populate("examCategories");
            if (!siteSetting)
                return next(new OperationalError(NOT_FOUND_ERROR, 'siteSetting'));
            return res.status(200).json(siteSetting.examCategories);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    }

};
export default siteSettingController;