import randomstring from "randomstring";
import mongoose from "mongoose";
// validations
import OperationalError, {
    ALREADY_EXISTS_ERROR,
    INVALID_OPERATION_ERROR,
    NOT_AUTHORIZED_ERROR,
    NOT_FOUND_ERROR,
} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";
import { SYSTEM_FISCAL_YEAR } from '../../config';
// model
import Exam from "../models/exam";
import ExamBasic from "../models/exam-basic";
import Booklet from "../models/booklet";
import BookletMaterial from "../models/booklet-material";
import MaterialQuestions from "../models/material-questions";
import Question from "../models/question";
import QuestionBank from "../models/question-bank";
import ExamProduction from "../models/exam-production";
import ExamPublish from "../models/exam-publish";
import ExamFactor from "../models/exam-factor";
import Option from "../models/option";
import SpecialExam from "../models/special-exam";
import Setting from '../models/site-setting';
import SalesSetting from '../models/sales-setting';
import FiscalYear from '../models/fiscal-year';
import PdfAnswer from '../models/pdf-answer'
import User from '../models/user'
import Lesson from '../models/lesson'
import Order from '../models/order'
import AnswerSheet from '../models/answer-sheet'
const debug = require("debug")("app:dev");

const examController = {
    createExam: async function (req, res, next) {
        try {

            const {
                title,
                bookletNumber,
                isPdfVersion
            } = req.body;
            const newExam = new Exam({
                title: title,
                bookletNumber: bookletNumber,
                isPdfVersion: isPdfVersion,
                code: randomstring.generate({
                    length: 10,
                    charset: "alphanumeric",
                }),
                user: req.user.id,
            });
            await newExam.save();
            return res.status(200).json(newExam);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    // showExamInfo: async function (req, res, next) {
    //   try {
    //     let exam = await Exam.findOne({
    //       _id: req.params.id,
    //       isDeleted: false
    //     });

    //     if (!exam) return next(new OperationalError(NOT_FOUND_ERROR, "exam"));

    //     let examInfo = await Object.create({});
    //     examInfo._id = exam._id;
    //     examInfo.title = exam.title;
    //     examInfo.isPdfVersion = exam.isPdfVersion;
    //     examInfo.bookletNumber = exam.bookletNumber;
    //     examInfo.code = exam.code;
    //     return res.status(200).json(examInfo);
    //   } catch (err) {
    //     return next(new ProgrammingError(err.message, err.stack));
    //   }
    // },
    createExamBasic: async function (req, res, next) {
        try {

            let examBasic = await ExamBasic.findOne({
                exam: req.params.id,
                isDeleted: false,
            });
            if (!examBasic) {
                const newExamBasic = new ExamBasic({
                    withCertificate: false,
                    organization: null,
                    organizationCode: null,
                    referenceFile: null,
                    withNegativePoint: false,
                    exam: req.params.id,
                    branch: null,
                    subBranch: null,
                    group: null,
                    subGroup: null,
                    user: req.user.id,
                });
                await newExamBasic.save();
                return res.status(200).json(newExamBasic);
            } else {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "examBasic"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamBasic: async function (req, res, next) {
        try {
            let examBasic = await ExamBasic.findOne({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: false
            })
                .populate("exam")
                .populate("branch")
                .populate("subBranch")
                .populate("group")
                .populate("subGroup")
                .populate("user");
            if (examBasic) {
                return res.status(200).json(examBasic);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examBasic"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createBooklet: async function (req, res, next) {
        try {
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (exam) {
                let bookletsCount = await Booklet.find({
                    exam: req.params.id,
                    isDeleted: false,
                    user: req.user.id,
                }).count();
                if (bookletsCount < exam.bookletNumber) {
                    const newBooklet = new Booklet({
                        title: req.body.title,
                        exam: req.params.id,
                        user: req.user.id,
                    });
                    await newBooklet.save();
                    return res.status(200).json(newBooklet);
                } else {
                    return next(new OperationalError(INVALID_OPERATION_ERROR, "booklet"));
                }
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createBookletMaterial: async function (req, res, next) {
        try {
            const {
                lesson,
                seasons,
                topics,
                factor,
                questionCount,
                time
            } = req.body;
            let booklet = await Booklet.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (booklet) {
                const newMaterial = new BookletMaterial({
                    booklet: req.params.id,
                    lesson: lesson,
                    seasons: seasons,
                    topics: topics,
                    factor: factor,
                    questionsCount: questionCount,
                    time: time,
                    user: req.user.id,
                    exam: booklet.exam,
                });
                debug(newMaterial);
                await newMaterial.save();
                return res.status(200).json(newMaterial);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "booklet"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    updateMaterialPdfFile: async function (req, res, next) {
        try {
            const { fileName } = req.body;
            let material = await BookletMaterial.findOne({ _id: res.params.id, isDeleted: false });
            if (!material)
                return next(new OperationalError(NOT_FOUND_ERROR, "materail"));
            let updatedMaterail = await BookletMaterial.updateOne({ _id: res.params.id, isDeleted: false }, {
                materialPdfFile: fileName,
                updatedAt: Date.now()
            })
            return res.status(200).json(updatedMaterial);
        } catch (err) {

        }
    },
    ShowBookletsOfExam: async function (req, res, next) {
        try {
            let foundExams = await Exam.find({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (foundExams) {
                let booklets = await Booklet.find({
                    exam: req.params.id,
                    isDeleted: false,
                    user: req.user.id,
                })
                    .populate("exam")
                    .populate("user");
                return res.status(200).json(booklets);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showMaterialsOfBooklet: async function (req, res, next) {
        try {
            let foundBooklet = await Booklet.find({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (foundBooklet) {
                let materials = await BookletMaterial.find({
                    booklet: req.params.id,
                    isDeleted: false,
                    user: req.user.id,
                })
                    .populate("booklet")
                    .populate("lesson")
                    .populate("seasons")
                    .populate("topics")
                    .populate("user");
                return res.status(200).json(materials);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getBookletMaterialsOfExam: async function (req, res, next) {
        try {
            let materials = await BookletMaterial.find({
                isDeleted: false,
                exam: req.params.id,
                user: req.user.id
            }).populate("lesson").populate("seasons").populate("topics").populate("booklet").populate("exam");
            return res.status(200).json(materials);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getBookletMaterial: async function (req, res, next) {
        try {
            let material = await BookletMaterial.findOne({
                isDeleted: false,
                _id: req.params.id
            }).populate("lesson").populate("seasons").populate("topics").populate("booklet").populate("exam").populate("user");
            if (!material) return next(new OperationalError(NOT_FOUND_ERROR, "material"));
            return res.status(200).json(material);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getMaterialQuestion: async function (req, res, next) {
        try {
            let bookletMaterial = await BookletMaterial.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!bookletMaterial) return next(new OperationalError(NOT_FOUND_ERROR, "bookletMaterial"));

            let materialQuestion = await MaterialQuestions.find({
                bookletMaterial: req.params.id,
                isDeleted: false
            }).populate("questions");
            return res.status(200).json(materialQuestion);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getOptionList: async function (req, res, next) {
        try {
            let options = await Option.find({
                user: req.user.id
            });
            return res.status(200).json(options);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    sendExamBasicRequest: async function (req, res, next) {
        try {
            const {
                withCertificate,
                organization,
                organizationCode,
                referenceFile,
                withNegativePoint,
                branch,
                subBranch,
                group,
                subGroup,
            } = req.body;
            let examBasic = await ExamBasic.findOne({
                _id: req.params.id,
                user: req.user.id,
                isSent: false,
                requestSentAt: null,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examBasic) {
                let examBasicRequest = await ExamBasic.updateOne({
                    _id: req.params.id,
                    user: req.user.id,
                    isSent: false,
                    requestSentAt: null,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    isSent: true,
                    requestSentAt: Date.now(),
                    withCertificate: withCertificate,
                    withCertificateAccepted: null,
                    withCertificateAnswered: null,
                    withCertificateMessage: null,
                    organization: organization,
                    organizationAccepted: null,
                    organizationAnswered: null,
                    organizationMessage: null,
                    organizationCode: organizationCode,
                    organizationCodeAccepted: null,
                    organizationCodeAnswered: null,
                    organizationCodeMessage: null,
                    referenceFile: referenceFile,
                    referenceFileAccepted: null,
                    referenceFileAnswered: null,
                    referenceFileMessage: null,
                    withNegativePoint: withNegativePoint,
                    branch: branch,
                    subBranch: subBranch,
                    group: group,
                    subGroup: subGroup,
                });
                return res.status(200).json(examBasicRequest);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examBasic"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamBasicRequest: async function (req, res, next) {
        try {
            let examBasic = await ExamBasic.findOne({
                _id: req.params.id,
                user: req.user.id,
                isSent: true,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examBasic) {
                return res.status(200).json(examBasic);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamBasicRequestByIdForAdmin: async function (req, res, next) {
        try {
            let examBasic = await ExamBasic.findOne({
                _id: req.params.id,
                isSent: true,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examBasic) {
                return res.status(200).json(examBasic);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examBasic"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamByIdForAdmin: async function (req, res, next) {
        try {
            let exam = await Exam.findOne({
                isDeleted: false,
                _id: req.params.id
            }).populate("user");
            if (!exam)
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            return res.status(200).json(exam);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getBookletsOfExamForAdmin: async function (req, res, next) {
        try {
            let booklets = await Booklet.find({
                isDeleted: false,
                exam: req.params.id
            }).populate("exam").populate("user");
            return res.status(200).json(booklets);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getBookletMaterialsOfExamForAdmin: async function (req, res, next) {
        try {
            let bookletMaterials = await BookletMaterial.find({
                isDeleted: false,
                booklet: req.params.id
            }).populate("booklet").populate("user").populate("exam").populate("lesson").populate("seasons").populate("topics");
            return res.status(200).json(bookletMaterials);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    examBasicRequestLisByExamId: async function (req, res, next) {
        try {
            let examBasics = await ExamBasic.find({
                exam: req.params.id,
                user: req.user.id,
                isSent: true,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examBasics) {
                return res.status(200).json(examBasics);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examBasics"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    examBasicRequestListByExamIdForAdmin: async function (req, res, next) {
        try {
            let examBasics = await ExamBasic.find({
                exam: req.params.id,
                isSent: true,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examBasics) {
                return res.status(200).json(examBasics);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examBasics"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    examBasicRequestLisByUserIdForAdmin: async function (req, res, next) {
        try {
            let examBasic = await ExamBasic.findOne({
                user: req.params.id,
                isSent: true,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examBasic) {
                return res.status(200).json(examBasic);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamBasicFieldHistory: async function (req, res, next) {
        try {
            let examBasics = await ExamBasic.find({
                _id: req.params.id
            }).populate(
                "exam"
            );
            if (examBasics) {
                return res.status(200).json(examBasics);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    handleExamBasicField: async function (req, res, next) {
        try {
            const {
                withCertificateAccepted,
                withCertificateMessage,
                organizationAccepted,
                organizationMessage,
                organizationCodeAccepted,
                organizationCodeMessage,
                referenceFileAccepted,
                referenceFileMessage,
            } = req.body;
            let examBasic = await ExamBasic.findOne({
                _id: req.params.id,
                isSent: true,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (withCertificateAccepted) {
                await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    withCertificateAccepted: true,
                    withCertificateAnswered: Date.now(),
                });
            } else {
                await ExamBasic.updateOne({
                    withCertificateAccepted: false,
                    withCertificateAnswered: Date.now(),
                    withCertificateMessage: withCertificateMessage,
                });
            }
            if (organizationAccepted) {
                await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    organizationAccepted: true,
                    organizationAnswered: Date.now(),
                });
            } else {
                await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    organizationAccepted: false,
                    organizationAnswered: Date.now(),
                    organizationMessage: organizationMessage,
                });
            }
            if (organizationCodeAccepted) {
                await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    organizationCodeAccepted: true,
                    organizationCodeAnswered: Date.now(),
                });
            } else {
                await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    organizationCodeAccepted: false,
                    organizationCodeAnswered: Date.now(),
                    organizationCodeMessage: organizationCodeMessage,
                });
            }
            if (referenceFileAccepted) {
                await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    referenceFileAccepted: true,
                    referenceFileAnswered: Date.now(),
                });
            } else {
                await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    referenceFileAccepted: false,
                    referenceFileAnswered: Date.now(),
                    referenceFileMessage: referenceFileMessage,
                });
            }
            return res.status(200).json({
                Updated: "ok"
            });
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    handleExamBasicState: async function (req, res, next) {
        try {
            if (req.body.isAccepted) {
                let examBasic = await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: true,
                    requestAcceptedAt: Date.now(),
                    isRejected: null,
                    requestRejectedAt: null,
                    updatedAt: Date.now(),
                    isDeleted: false,
                });
                return res.status(200).json(examBasic);
            }
            if (req.body.isRejected) {
                let examBasic = await ExamBasic.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: true,
                    requestRejectedAt: Date.now(),
                    updatedAt: Date.now(),
                    isDeleted: true,
                });
                return res.status(200).json(examBasic);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    cloneExamBasicCollection: async function (req, res, next) {
        try {

            let deletedExamBasic = await ExamBasic.findOne({
                _id: req.params.id,
                isDeleted: true,
            });
            const deepClone = JSON.parse(JSON.stringify(deletedExamBasic));
            Object.assign(deepClone, {
                isDeleted: false,
                referenceId: deletedExamBasic.id,
                _id: mongoose.Types.ObjectId(),
                isSent: false,
                updatedAt: Date.now(),
                requestSentAt: null,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
            });
            debug("deepClone", deepClone);

            let newExamBasic = new ExamBasic(deepClone);
            await newExamBasic.save();
            return res.status(200).json(newExamBasic);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    //Exam Production Step
    // ExamBasic accepted by Admin => Then by clicking the accept button, the initial createExamProduction will be executed for User => Afterwards, the user is abale to handle to ExamProduction step!
    createExamProduction: async function (req, res, next) {
        try {
            let examProduction = await ExamProduction.findOne({
                exam: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (!examProduction) {
                const newExamProduction = new ExamProduction({
                    exam: req.params.id,
                    webcamActive: false,
                    soundActive: false,
                    user: req.user.id,
                });
                await newExamProduction.save();
                return res.status(200).json(newExamProduction);
            } else {
                return next(
                    new OperationalError(INVALID_OPERATION_ERROR, "examProduction")
                );
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    showExamProduction: async function (req, res, next) {
        try {
            let examProduction = await ExamProduction.findOne({
                exam: req.params.id,
                isDeleted: false,
                user: req.user.id,
            })
                .populate("exam")
                .populate("user");
            if (examProduction) {
                return res.status(200).json(examProduction);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examProduction"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createMaterialQuestions: async function (req, res, next) {
        try {
            const {
                bankQuestionsCount,
                isRandomSelection,
                hardQuestionsCount,
                simpleQuestionsCount,
                privateQuestionsCount,
            } = req.body;
            let material = await BookletMaterial.findOne({
                _id: req.params.id,
                user: req.user.id,
                isDeleted: false,
            }).populate("booklet");
            debug("material", material);
            if (material) {
                // if (bankQuestionsCount == 0) {
                //     if (isRandomSelection) {
                //         return next(
                //             new OperationalError(INVALID_OPERATION_ERROR, "isRandomSelection")
                //         );
                //     }
                //     if (hardQuestionsCount != null || simpleQuestionsCount != null) {
                //         return next(
                //             new OperationalError(INVALID_OPERATION_ERROR, "difficulty")
                //         );
                //     }
                // }
                // debug({
                //     hard: hardQuestionsCount,
                //     simple: simpleQuestionsCount,
                //     bank: bankQuestionsCount,
                // });
                // if (
                //     parseInt(bankQuestionsCount) !=
                //     parseInt(hardQuestionsCount) + parseInt(simpleQuestionsCount)
                // ) {
                //     return next(
                //         new OperationalError(
                //             INVALID_OPERATION_ERROR,
                //             "questionDifficultyCountMixture"
                //         )
                //     );
                // }
                // const questionsCount = material.questionsCount;
                // debug("questionsCount", questionsCount);
                // if (
                //     parseInt(bankQuestionsCount) + parseInt(privateQuestionsCount) !=
                //     parseInt(questionsCount)
                // ) {
                //     return next(
                //         new OperationalError(INVALID_OPERATION_ERROR, "questionCount")
                //     );
                // }
                const newMaterialQuestions = new MaterialQuestions({
                    bookletMaterial: req.params.id,
                    bankQuestionsCount: bankQuestionsCount,
                    isRandomSelection: isRandomSelection,
                    hardQuestionsCount: hardQuestionsCount,
                    simpleQuestionsCount: simpleQuestionsCount,
                    privateQuestionsCount: privateQuestionsCount,
                    user: req.user.id,
                });
                await newMaterialQuestions.save();
                return res.status(200).json(newMaterialQuestions);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "materialQuestions"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showBankForMaterialQuestions: async function (req, res, next) {
        try {
            let material = await BookletMaterial.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            })
                .populate("booklet")
                .populate("lesson")
                .populate("seasons")
                .populate("topics");
            if (material) {
                let qbank = await QuestionBank.findOne({
                    lesson: material.lesson.id,
                    isDeleted: false,
                    user: req.user.id,
                })
                    .populate("qbank")
                    .populate("lesson")
                    .populate("user");
                if (qbank) {
                    let questions = await Question.find({
                        qbank: qbank.id,
                        isDeleted: false,
                        user: req.user.id,
                    }).populate("lesson").populate("season").populate("topic").populate("qbank").populate("fiscalYear").populate("user");
                    return res.status(200).json(questions);
                } else {
                    return next(new OperationalError(NOT_FOUND_ERROR, "qbank"));
                }
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "material"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    defineNewQuestion: async function (req, res, next) {
        try {
            const {
                text,
                type,
                optionsCount,
                difficulty,
                resource,
                season,
                topic,
                fiscalYear,
                image,
            } = req.body;
            let bookletMaterial = await BookletMaterial.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (!bookletMaterial) {
                return next(new OperationalError(NOT_FOUND_ERROR, "material"));
            } else {
                let lesson = bookletMaterial.lesson;
                if (type == 1) {
                    const newQuestion = new Question({
                        text: text,
                        code: randomstring.generate({
                            length: 10,
                            charset: "alphanumeric",
                        }),
                        type: 1,
                        optionsCount: 0,
                        difficulty: difficulty,
                        resource: resource,
                        lesson: lesson,
                        season: season,
                        topic: topic,
                        fiscalYear: fiscalYear,
                        user: req.user.id,
                        image: image,
                    });
                    await newQuestion.save();
                    return res.status(200).json(newQuestion);
                }
                if (type == 2 || type == 3) {
                    const newQuestion = new Question({
                        text: text,
                        code: randomstring.generate({
                            length: 10,
                            charset: "alphanumeric",
                        }),
                        type: type,
                        optionsCount: optionsCount,
                        difficulty: difficulty,
                        resource: resource,
                        lesson: lesson,
                        season: season,
                        topic: topic,
                        fiscalYear: fiscalYear,
                        user: req.user.id,
                        image: image,
                    });
                    await newQuestion.save();
                    return res.status(200).json(newQuestion);
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    addQuestionToMaterial: async function (req, res, next) {
        try {

            let material = await BookletMaterial.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            let lesson = material.lesson;
            if (!lesson || !material) {
                return next(new OperationalError(NOT_FOUND_ERROR, "lesson"));
            } else {
                let updatedMaterialQuestions = await MaterialQuestions.updateOne({
                    bookletMaterial: req.params.id,
                    isDeleted: false,
                    user: req.user.id,
                }, {
                    questions: req.body.question,
                });
                return res.status(200).json(updatedMaterialQuestions);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    addQuestionToBank: async function (req, res, next) {
        try {
            let question = await Question.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            debug("question", question);
            if (!question) {
                return next(new OperationalError(NOT_FOUND_ERROR, "question"));
            } else {
                let qbank = await QuestionBank.findOne({
                    lesson: question.lesson,
                    isDeleted: false,
                    user: req.user.id,
                });
                debug("question", question);
                if (!qbank) {
                    return next(new OperationalError(NOT_FOUND_ERROR, "qbank"));
                } else {
                    let updatedQBank = await Question.updateOne({
                        _id: req.params.id,
                        isDeleted: false,
                        user: req.user.id,
                    }, {
                        qbank: qbank.id
                    });
                    return res.status(200).json(updatedQBank);
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    addOptionToQuestion: async function (req, res, next) {
        try {
            const {
                isCorrect,
                text,
                image,
                point
            } = req.body;
            let question = await Question.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            let type = question.type;
            let optionsCounted = question.optionsCount;

            switch (type) {
                case 1: {
                    return next(
                        new OperationalError(INVALID_OPERATION_ERROR, "addingOption")
                    );
                }
                case 2: {
                    let optionsAdded = await Option.find({
                        question: req.params.id,
                        isDeleted: false,
                    }).count();
                    if (optionsAdded < optionsCounted) {
                        let correctOptions = await Option.find({
                            question: req.params.id,
                            isCorrect: true,
                            isDeleted: false,
                        }).count();
                        if (correctOptions > 0 && isCorrect == "true") {
                            return next(
                                new OperationalError(
                                    INVALID_OPERATION_ERROR,
                                    "addingMoreCorrectOption"
                                )
                            );
                        }
                        if (optionsAdded == optionsCounted - 1) {
                            if (correctOptions == 0 && isCorrect == "false") {
                                return next(
                                    new OperationalError(
                                        INVALID_OPERATION_ERROR,
                                        "NoCorrectOptionSelected"
                                    )
                                );
                            } else {
                                const newOption = new Option({
                                    text: text,
                                    image: image,
                                    isCorrect: isCorrect,
                                    point: 1,
                                    question: req.params.id,
                                });
                                await newOption.save();
                                return res.status(200).json(newOption);
                            }
                        } else {
                            const newOption = new Option({
                                text: text,
                                image: image,
                                isCorrect: isCorrect,
                                point: 1,
                                question: req.params.id,
                                user: req.user.id,
                            });
                            await newOption.save();
                            return res.status(200).json(newOption);
                        }
                    } else {
                        return next(
                            new OperationalError(INVALID_OPERATION_ERROR, "addingMoreOption")
                        );
                    }
                }
                case 3: {
                    let optionsAdded = await Option.find({
                        question: req.params.id,
                        isDeleted: false,
                    }).count();
                    if (optionsAdded < optionsCounted) {
                        const newOption = new Option({
                            text: text,
                            image: image,
                            isCorrect: true,
                            point: point,
                            question: req.params.id,
                            user: req.user.id,
                        });
                        await newOption.save();
                        return res.status(200).json(newOption);
                    } else {
                        return next(
                            new OperationalError(INVALID_OPERATION_ERROR, "addingMoreOption")
                        );
                    }
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    selectRandomQuestion: async function (req, res, next) {
        try {
            let material = await BookletMaterial.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (material) {
                let qbank = await QuestionBank.find({
                    lesson: material.lesson,
                    isDeleted: false,
                    user: req.user.id,
                });
                if (qbank) {
                    let questions = await Question.find({
                        qbank: qbank.id,
                        isDeleted: false,
                        user: req.user.id,
                    });
                    if (questions) {
                        let questionArrayLength = questions.length;
                        debug("questionArrayLength", questionArrayLength);
                        let materialQuestion = await MaterialQuestions.findOne({
                            bookletMaterial: req.params.id,
                            isDeleted: false,
                            user: req.user.id,
                        });
                        debug("materialQuestion", materialQuestion);
                        debug({
                            hardQuestionCount: materialQuestion.hardQuestionsCount,
                            simpleQuestionCounts: materialQuestion.simpleQuestionsCount,
                        });
                        let randomSelectionArrayLength =
                            await (materialQuestion.hardQuestionsCount +
                                materialQuestion.simpleQuestionsCount);
                        debug("randomSelectionArrayLength", randomSelectionArrayLength);
                        if (questionArrayLength >= randomSelectionArrayLength) {
                            // Shuffle array
                            let shuffled = await questions.sort(() => 0.5 - Math.random());
                            // Get sub-array of first n elements after shuffled
                            let selected = await shuffled.slice(
                                0,
                                randomSelectionArrayLength
                            );
                            debug("Selected random questions: ", selected);
                            return res.status(200).json(selected);
                        } else {
                            return next(
                                new OperationalError(
                                    INVALID_OPERATION_ERROR,
                                    "requestedQuestionCountFromBank"
                                )
                            );
                        }
                    } else {
                        return next(new OperationalError(NOT_FOUND_ERROR, "questions"));
                    }
                } else {
                    return next(new OperationalError(NOT_FOUND_ERROR, "qbank"));
                }
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "lesson"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    sendExamProductionRequest: async function (req, res, next) {
        try {
            const {
                webcamActive,
                soundActive
            } = req.body;
            let examProduction = await ExamProduction.findOne({
                _id: req.params.id,
                user: req.user.id,
                isSent: false,
                requestSentAt: null,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                // updatedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examProduction) {
                let examProductionRequest = await ExamProduction.updateOne({
                    _id: req.params.id,
                    user: req.user.id,
                    isSent: false,
                    requestSentAt: null,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    // updatedAt: null,
                    isDeleted: false,
                }, {
                    isSent: true,
                    requestSentAt: Date.now(),
                    webcamActive: webcamActive,
                    soundActive: soundActive,
                });
                return res.status(200).json(examProductionRequest);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examProduction"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamProductionRequestsForAdmin: async function (req, res, next) {
        try {
            let examProductions = await ExamProduction.find({
                isDeleted: false,
                isSent: true,
                isAccepted: false,
                isRejected: false
            }).populate("exam").populate("user");
            return res.status(200).json(examProductions);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamProductionRequestByIdForAdmin: async function (req, res, next) {
        try {
            let examProduction = await ExamProduction.findOne({
                _id: req.params.id,
                isDeleted: false,
                isSent: true,
                isAccepted: false,
                isRejected: false
            }).populate("exam").populate("user");
            if (!examProduction) return next(new OperationalError(NOT_FOUND_ERROR, "examProduction"));
            return res.status(200).json(examProduction);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },


    createExamPublish: async function (req, res, next) {
        try {
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            let examPublish = await ExamPublish.findOne({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: false,
            });
            if (!examPublish) {
                const newExamPublish = new ExamPublish({
                    exam: exam._id,
                    user: req.user.id,
                });
                await newExamPublish.save();
                return res.status(200).json(newExamPublish);
            } else {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "examPublish"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createExamFactor: async function (req, res, next) {
        try {
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            debug("exam", exam);
            if (exam) {
                let examFactor = await ExamFactor.findOne({
                    exam: req.params.id,
                    user: req.user.id,
                    isDeleted: false,
                }).populate("exam");
                debug("examFactor", examFactor);
                if (!examFactor) {
                    debug("examTitle", exam.title);
                    const newExamFactor = new ExamFactor({
                        code: randomstring.generate({
                            length: 10,
                            charset: "alphanumeric",
                        }),
                        user: req.user.id,
                        title: "فاکتور ایجاد آزمون ",
                        totalPrice: 0,
                        payablePrice: 0,
                        serverCost: 0,
                        examCost: 0,
                        questionsCount: 0,
                        rulesAcception: req.body.rulesAcception,
                        isPaid: false,
                        paidAt: null,
                        exam: exam.id,
                    });
                    debug(newExamFactor);
                    await newExamFactor.save();
                    return res.status(200).json(newExamFactor);
                } else {
                    return next(new OperationalError(ALREADY_EXISTS_ERROR, "examFactor"));
                }
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamPublish: async function (req, res, next) {
        try {
            let examPublish = await ExamPublish.findOne({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: false,
            })
                .populate("exam")
                .populate("user");
            if (examPublish) {
                return res.status(200).json(examPublish);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examPublish"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    sendExamPublishRequest: async function (req, res, next) {
        try {
            const {
                price,
                registerTime,
                startTime
            } = req.body;
            let examPublish = await ExamPublish.findOne({
                _id: req.params.id,
                user: req.user.id,
                isSent: false,
                requestSentAt: null,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                // updatedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (examPublish) {
                if (req.body.joinTimeLimitation) {
                    let examPublishRequest = await ExamPublish.updateOne({
                        _id: req.params.id,
                        user: req.user.id,
                        isSent: false,
                        requestSentAt: null,
                        isAccepted: null,
                        requestAcceptedAt: null,
                        isRejected: null,
                        requestRejectedAt: null,
                        // updatedAt: null,
                        isDeleted: false,
                    }, {
                        isSent: true,
                        requestSentAt: Date.now(),
                        price: price,
                        joinTimeLimitation: true,
                        registerTime: registerTime,
                        startTime: startTime,
                    });
                    return res.json(examPublishRequest);
                } else {
                    let examPublishRequest = await ExamPublish.updateOne({
                        _id: req.params.id,
                        user: req.user.id,
                        isSent: false,
                        requestSentAt: null,
                        isAccepted: null,
                        requestAcceptedAt: null,
                        isRejected: null,
                        requestRejectedAt: null,
                        // updatedAt: null,
                        isDeleted: false,
                    }, {
                        isSent: true,
                        requestSentAt: Date.now(),
                        price: price,
                        joinTimeLimitation: false,
                        registerTime: registerTime,
                        startTime: null,
                    });
                    return res.json(examPublishRequest);
                }
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examPublish"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamPublishRequestsForAdmin: async function (req, res, next) {
        try {
            let examPublishes = await ExamPublish.find({
                isDeleted: false,
                isSent: true,
                isAccepted: false,
                isRejected: false
            }).populate("exam").populate("user");
            return res.status(200).json(examPublishes);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamPublishRequestByIdForAdmin: async function (req, res, next) {
        try {
            let examPublish = await ExamPublish.findOne({
                _id: req.params.id,
                isDeleted: false,
                isSent: true,
                isAccepted: false,
                isRejected: false
            }).populate("exam").populate("user");
            if (!examPublish) return next(new OperationalError(NOT_FOUND_ERROR, "examPublish"));
            return res.status(200).json(examPublish);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    handleExamPublishField: async function (req, res, next) {
        try {
            const {
                registerTimeAccepted,
                registerTimeMessage,
                startTimeAccepted,
                startTimeMessage,
                priceAccepted,
                priceMessage,
            } = req.body;
            let examPublish = await ExamPublish.findOne({
                _id: req.params.id,
                isSent: true,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isDeleted: false,
            }).populate("exam");
            if (registerTimeAccepted) {
                await ExamPublish.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    registerTimeAccepted: true,
                    registerTimeAnswered: Date.now(),
                });
            } else {
                await ExamPublish.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    registerTimeAccepted: false,
                    registerTimeAnswered: Date.now(),
                    registerTimeMessage: registerTimeMessage,
                });
            }
            if (startTimeAccepted) {
                await ExamPublish.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    startTimeAccepted: true,
                    startTimeAnswered: Date.now(),
                });
            } else {
                await ExamPublish.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    startTimeAccepted: false,
                    startTimeAnswered: Date.now(),
                    startTimeMessage: startTimeMessage,
                });
            }
            if (priceAccepted) {
                await ExamPublish.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    priceAccepted: true,
                    priceAnswered: Date.now(),
                });
            } else {
                await ExamPublish.updateOne({
                    _id: req.params.id,
                    isSent: true,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    isDeleted: false,
                }, {
                    priceAccepted: false,
                    priceAnswered: Date.now(),
                    priceMessage: priceMessage,
                });
            }
            return res.status(200).json({
                Updated: "ok"
            });
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },


    createExamFactor: async function (req, res, next) {
        try {
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            debug("exam", exam);
            if (exam) {
                let examFactor = await ExamFactor.findOne({
                    exam: req.params.id,
                    user: req.user.id,
                    isDeleted: false,
                }).populate("exam");
                debug("examFactor", examFactor);
                if (!examFactor) {
                    debug("examTitle", exam.title);
                    const newExamFactor = new ExamFactor({
                        code: randomstring.generate({
                            length: 10,
                            charset: "alphanumeric",
                        }),
                        user: req.user.id,
                        title: "فاکتور آزمون: " + exam.title,
                        totalPrice: 0,
                        payablePrice: 0,
                        totalDiscount: 0,
                        rulesAcception: false,
                        serverCost: 0,
                        examCost: 0,
                        isPaid: false,
                        paidAt: null,
                        exam: req.params.id,
                    });
                    debug(newExamFactor);
                    await newExamFactor.save();
                    return res.status(200).json(newExamFactor);
                } else {
                    return next(new OperationalError(ALREADY_EXISTS_ERROR, "examFactor"));
                }
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamFactor: async function (req, res, next) {
        try {
            let examFactor = await ExamFactor.findOne({
                exam: req.params.id,
                isDeleted: false,
                user: req.user.id,
            })
                .populate("user")
                .populate("exam");
            if (examFactor) {
                return res.status(200).json(examFactor);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamFactorByIdForAdmin: async function (req, res, next) {
        try {
            let examFactor = await ExamFactor.findOne({
                _id: req.params.id,
                isDeleted: false,
            })
                .populate("user")
                .populate("exam");
            if (examFactor) {
                return res.status(200).json(examFactor);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamFactorsListForAdmin: async function (req, res, next) {
        try {
            let examFactors = await ExamFactor.find({
                isDeleted: false,
            })
                .populate("user")
                .populate("exam");
            if (examFactors) {
                return res.status(200).json(examFactors);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    setExamFactorToIsPaid: async function (req, res, next) {
        try {
            let examFactor = await ExamFactor.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            if (!examFactor) {
                return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            }
            let updated = await ExamFactor.updateOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            }, {
                isPaid: true,
                paidAt: Date.now(),
                updatedAt: Date.now(),
            });
            return res.status(200).json(updated);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    setToCompletedExamProcedure: async function (req, res, next) {
        try {
            let examFactor = await ExamFactor.findOne({
                exam: req.params.id,
                isDeleted: false,
                isPaid: true,
            });
            if (!examFactor) {
                return next(new OperationalError(NOT_FOUND_ERROR, "examFactor"));
            }
            let updatedExam = await Exam.updateOne({
                _id: req.params.id,
                isDeleted: false
            }, {
                isCompleted: true,
                updatedAt: Date.now(),
            });
            return res.status(200).json(updatedExam);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getUncompletedExamsList: async function (req, res, next) {
        try {
            let uncompletedExamList = await Exam.find({
                isDeleted: false,
                user: req.user.id,
                isCompleted: false,
            });
            let examArr = [];
            for (let exam of uncompletedExamList) {
                let examBasic = await ExamBasic.findOne({
                    exam: exam._id,
                    isDeleted: false,
                    user: req.user.id,
                })
                    .populate("branches")
                    .populate("subBranches")
                    .populate("groups")
                    .populate("subGroups")
                    .populate("exam")
                    .populate("user");
                let examProduction = await ExamProduction.findOne({
                    exam: exam._id,
                    isDeleted: false,
                    user: req.user.id,
                })
                    .populate("exam")
                    .populate("user");
                let examPublish = await ExamPublish.findOne({
                    exam: exam._id,
                    isDeleted: false,
                    user: req.user.id,
                })
                    .populate("exam")
                    .populate("user");
                let examFactor = await ExamFactor.findOne({
                    exam: exam._id,
                    isDeleted: false,
                    user: req.user.id,
                })
                    .populate("exam")
                    .populate("user");
                examArr.push({
                    exam: exam,
                    examBasic: examBasic,
                    examProduction: examProduction,
                    examPublish: examPublish,
                    examFactor: examFactor,
                });
            }
            return res.status(200).json(examArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showUserExamsForAdmin: async function (req, res, next) {
        try {
            let user = await User.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!user) {
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            }
            let exams = await Exam.find({
                user: req.user.id,
                isDeleted: false
            });
            let examInfoArr = [];
            for (let exam of exams) {
                let userExamInfo = await Object.create({});
                let examBasic = ExamBasic.findOne({
                    exam: exam.id,
                    isDeleted: false
                });
                let examProduction = await ExamProduction.findOne({
                    exam: exam.id,
                    isDeleted: false,
                });
                let examPublish = await ExamPublish.findOne({
                    exam: exam.id,
                    isDeleted: false,
                });
                let examFactor = await ExamFactor.findOne({
                    exam: exam.id,
                    isDeleted: false,
                });
                if (!examBasic) {
                    userExamInfo.examBasic = null;
                } else {
                    userExamInfo.examBasic = examBasic.isAccepted;
                }
                if (!examProduction) {
                    userExamInfo.examProduction = null;
                } else {
                    userExamInfo.examProduction = examProduction.isAccepted;
                }
                if (!examPublish) {
                    userExamInfo.examPublish = null;
                } else {
                    userExamInfo.examPublish = examPublish.isAccepted;
                }
                if (!examFactor) {
                    userExamInfo.examFactor = null;
                } else {
                    userExamInfo.examFactor = examFactor.isPaid;
                }

                userExamInfo.title = exam.title;
                userExamInfo.createdAt = exam.createdAt;
                userExamInfo.isCompleted = exam.isCompleted;
                userExamInfo.code = exam.Code;
                examInfoArr.push(userExamInfo);
            }
            return res.status(200).json(examInfoArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamListForAdmin: async function (req, res, next) {
        try {
            let exams = await Exam.find({
                isDeleted: false
            });
            debug("exams", exams);
            let examInfoArr = [];
            for (let exam of exams) {
                let userExamInfo = await Object.create({});
                let examBasic = await ExamBasic.findOne({
                    exam: exam._id,
                    isDeleted: false,
                }).populate("branch").populate("subBranch").populate("group").populate("subGroup").populate("user");
                let examProduction = await ExamProduction.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examPublish = await ExamPublish.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examFactor = await ExamFactor.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });

                if (!examBasic) {
                    userExamInfo.examBasic = null;
                } else {
                    userExamInfo.examBasic = examBasic;
                }
                if (!examProduction) {
                    userExamInfo.examProduction = null;
                } else {
                    userExamInfo.examProduction = examProduction;
                }
                if (!examPublish) {
                    userExamInfo.examPublish = null;
                } else {
                    userExamInfo.examPublish = examPublish;
                }
                if (!examFactor) {
                    userExamInfo.examFactor = null;
                } else {
                    userExamInfo.examFactor = examFactor;
                }

                userExamInfo.title = exam.title;
                userExamInfo.createdAt = exam.createdAt;
                userExamInfo.isCompleted = exam.isCompleted;
                userExamInfo.code = exam.code;
                examInfoArr.push(userExamInfo);
            }
            return res.status(200).json(examInfoArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamList: async function (req, res, next) {
        try {
            let exams = await Exam.find({
                user: req.user.id,
                isDeleted: false
            });
            debug("exams", exams);
            let examInfoArr = [];
            for (let exam of exams) {
                let userExamInfo = await Object.create({});
                let examBasic = await ExamBasic.findOne({
                    exam: exam._id,
                    isDeleted: false,
                }).populate('branch').populate('subBranch').populate('group').populate('subGroup').populate('exam');
                let examProduction = await ExamProduction.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examPublish = await ExamPublish.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examFactor = await ExamFactor.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });

                if (!examBasic) {
                    userExamInfo.examBasic = null;
                } else {
                    userExamInfo.examBasic = examBasic;
                }
                if (!examProduction) {
                    userExamInfo.examProduction = null;
                } else {
                    userExamInfo.examProduction = examProduction;
                }
                if (!examPublish) {
                    userExamInfo.examPublish = null;
                } else {
                    userExamInfo.examPublish = examPublish;
                }
                if (!examFactor) {
                    userExamInfo.examFactor = null;
                } else {
                    userExamInfo.examFactor = examFactor;
                }

                userExamInfo.title = exam.title;
                userExamInfo.createdAt = exam.createdAt;
                userExamInfo.isCompleted = exam.isCompleted;
                userExamInfo.code = exam.code;
                examInfoArr.push(userExamInfo);
            }
            console.log(examInfoArr);
            return res.status(200).json(examInfoArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    showStudentExamList: async function (req, res, next) {
        try {

            let orders = await Order.find({user: req.user.id, orderType:"exam", isPaid:true})
           
            let examInfoArr = [];
            for (let order of orders) {
                let exam = await Exam.findOne({_id:order.exam})
                let bookletMaterials = await BookletMaterial.find({
                    exam:exam._id,
                    isDeleted: false,
                });

                let totalTime = await bookletMaterials.reduce((prev, item) => {
                    return prev + item.time;
                }, 0);
                
                let userExamInfo = await Object.create({});
                let examBasic = await ExamBasic.findOne({
                    exam: exam._id,
                    isDeleted: false,
                }).populate('branch').populate('subBranch').populate('group').populate('subGroup').populate('exam');
                let examProduction = await ExamProduction.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examPublish = await ExamPublish.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examFactor = await ExamFactor.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let minutesToAdd = totalTime;
                var examinationEndTime = new Date(examPublish.startTime.getTime() + minutesToAdd*60000);
                if (!examBasic) {
                    userExamInfo.examBasic = null;
                } else {
                    userExamInfo.examBasic = examBasic;
                }
                if (!examProduction) {
                    userExamInfo.examProduction = null;
                } else {
                    userExamInfo.examProduction = examProduction;
                }
                if (!examPublish) {
                    userExamInfo.examPublish = null;
                } else {
                    userExamInfo.examPublish = examPublish;
                }
                if (!examFactor) {
                    userExamInfo.examFactor = null;
                } else {
                    userExamInfo.examFactor = examFactor;
                }
                if(exam.isPdfVersion == true){
                    let pdfAnswers = await PdfAnswer.find({exam: exam._id, user:req.user.id});
                    if(pdfAnswers.length > 0 ){
                        userExamInfo.state = "شرکت کرده"
                        

                    }else{
                        userExamInfo.state = "شرکت نکرده"
                    }
                }else{
                    let answerSheets = await AnswerSheet.find({exam: exam_id, user:req.user.id});
                    if(answerSheets.length > 0 ){
                        userExamInfo.state = "شرکت کرده"

                    }else{
                        userExamInfo.state = "شرکت نکرده"
                    }
                }
                userExamInfo.title = exam.title;
                userExamInfo.examId = exam._id;
                userExamInfo.createdAt = exam.createdAt;
                userExamInfo.isCompleted = exam.isCompleted;
                userExamInfo.code = exam.code;
                userExamInfo.examinationEndTime = examinationEndTime;
                examInfoArr.push(userExamInfo);
            }
            console.log(examInfoArr);
            return res.status(200).json(examInfoArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    createSpecialExam: async function (req, res, next) {
        try {
            let exam = await findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!exam) return next(new OperationalError(NOT_FOUND_ERROR, "exam"));

            let newSpecialExam = await new SpecialExam({
                exam: exam.id,
                purchaseTime: null,
                expireTime: null,
                status: "created",
                createdAt: Date.now(),
            });
            await newSpecialExam.save();
            return res.status(200).json(newSpecialExam);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    SpecialExamList: async function (req, res, next) {
        try {
            let specialExams = await SpecialExam.find({
                isDeleted: false
            }, {
                projection: {
                    _id: 0
                }
            }).populate(
                "exam"
            );
            return res.status(200).json(specialExams);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getSlotSchedule: async function (req, res, next) {
        try {
            let scheduleArr = [];
            let specialExams = await SpecialExam.find({
                isDeleted: false,
                status: "active",
                expireTime: !null
            }).where('expireTime').gt(Date.now());

            for (let exam of specialExams) {
                scheduleArr.push({
                    _id: exam._id,
                    startTime: exam.startTime,
                    expireTime: exam.expireTime,
                    duration: exam.duration,
                });
            }
            return res.status(200).json(scheduleArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    changeSpecialExamStatus: async function (req, res, next) {
        try {
            const {
                duration,
                startTime
            } = req.body;
            let specialExam = await SpecialExam.findOne({
                _id: req.params.id,
                isDeleted: false,
            });
            if (!specialExam)
                return next(new OperationalError(NOT_FOUND_ERROR, "specialExam"));

            const specialExamSlots = 4;
            let specialExamCount = await SpecialExam.find({
                isDeleted: false,
                status: "active"
            }).where("expireTime").gt(Date.now()).count();
            if (specialExamSlots > specialExamCount) {
                const expireTime = new Date(
                    startTime.setMonth(startTime.getMonth() + duration)
                );
                let updateSpecialExam = await SpecialExam.updateOne({
                    _id: req.params.id,
                    isDeleted: false
                }, {
                    status: "active",
                    purchaseTime: Date.now(),
                    startTime: startTime,
                    expireTime: expireTime,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(updateSpecialExam);
            } else {
                return next(
                    new OperationalError(INVALID_OPERATION_ERROR, "specialExam")
                );
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deActivateSpecialExam: async function (req, res, next) {
        try {
            let specialExam = await SpecialExam.findOne({
                _id: req.params.id,
                isDeleted: false,
            });
            if (!specialExam)
                return next(new OperationalError(NOT_FOUND_ERROR, "specialExam"));
            let deActivatingSpecialExam = await SpecialExam.updateOne({
                _id: req.params.id,
                isDeleted: false
            }, {
                status: "deActive",
                updatedAt: Date.now(),
            });
            return res.status(200).json(deActivatingSpecialExam);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamDetail: async function (req, res, next) {
        try {
            let result = Object.create({});
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });
            let examBasic = await ExamBasic.findOne({
                exam: req.params.id,
                isDeleted: false,
                user: req.user.id,
            });

            if (exam && examBasic) {
                let booklets = await Booklet.find({
                    exam: req.params.id,
                    isDeleted: false,
                    user: req.user.id,
                });
                let bookletMaterials = await BookletMaterial.find({
                    exam: req.params.id,
                    isDeleted: false,
                });
                let bookletMaterialCount = bookletMaterials.count();
                debug("bookletMaterials", bookletMaterials);
                let questionsCount = await bookletMaterials.reduce((prev, item) => {
                    return prev + item.questionsCount;
                }, 0);
                let totalTime = await bookletMaterials.reduce((prev, item) => {
                    return prev + item.time;
                }, 0);
                let bookletArr = [];
                for (let booklet of booklets) {
                    let materials = await BookletMaterial.find({
                        booklet: booklet.id,
                        user: req.user.id,
                        isDeleted: false,
                    })
                        .populate("lesson")
                        .populate("seasons")
                        .populate("topics");
                    debug("materials", materials);
                    let bookletQuestionsCount = 0;
                    let bookletTotalTime = 0;

                    for (let material of materials) {
                        bookletQuestionsCount += material.questionsCount;
                        bookletTotalTime += material.time;
                    }
                    // please check the performance of these two FOR loops by replacing other method such as reduce
                    // which it seems has lower performance compared with for loop! btw its better to check the performance! :)
                    let bookletObj = Object.create({});
                    bookletObj._id = booklet._id;
                    bookletObj.title = booklet.title;
                    bookletObj.bookletMaterials = materials;
                    bookletObj.bookletQuestionsCount = bookletQuestionsCount;
                    bookletObj.bookletTotalTime = bookletTotalTime;
                    bookletArr.push(bookletObj);
                }

                result.title = exam.title;
                result.bookletNumber = exam.bookletNumber;
                result.questionsCount = questionsCount;
                result.totalTime = totalTime;
                result.examCode = exam.code;
                result.booklets = bookletArr;
                result.withNegativePoint = examBasic.withNegativePoint;
                result.isPdfVersion = exam.isPdfVersion;
                result.isCompleted = exam.isCompleted;
                result.isPaid = examFactor.isPaid;
                result.joinTimeLimitation = examPublish.joinTimeLimitation;
                result.startTime = examPublish.startTime;
                result.registerTime = examPublish.registerTime;
                result.price = examPublish.price;
                result.studentCount = 10;
                result.salePortion = "10%";
                result.saleProfit = 100000;
                result.saleWithdraw = 10000;
                result.withCertificate = examBasic.withCertificate;
                result.organization = examBasic.organization;
                result.organizationCode = examBasic.organizationCode;
                result.referenceFile = examBasic.referenceFile;
                result.questionMaterialCount = bookletMaterialCount;
                debug(result);
                return res.status(200).json(result);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examOrExamBasic"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamDetailForClient: async function (req, res, next) {
        try {
            let result = Object.create({});
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                isCompleted: true
            }).populate("user");
            let examBasic = await ExamBasic.findOne({
                exam: req.params.id,
                isDeleted: false,
            }).populate("branch").populate("subBranch").populate("group").populate("subGroup");

            if (exam && examBasic) {
                let booklets = await Booklet.find({
                    exam: req.params.id,
                    isDeleted: false,
                });
                let bookletMaterials = await BookletMaterial.find({
                    exam: req.params.id,
                    isDeleted: false,
                });
                let bookletMaterialCount = bookletMaterials.length;
                debug("bookletMaterials", bookletMaterials);
                let questionsCount = await bookletMaterials.reduce((prev, item) => {
                    return prev + item.questionsCount;
                }, 0);
                let totalTime = await bookletMaterials.reduce((prev, item) => {
                    return prev + item.time;
                }, 0);
                let bookletArr = [];
                for (let booklet of booklets) {
                    let materials = await BookletMaterial.find({
                        booklet: booklet.id,
                        isDeleted: false,
                    })
                        .populate("lesson")
                        .populate("seasons")
                        .populate("topics");

                    debug("materials", materials);
                    let bookletQuestionsCount = 0;
                    let bookletTotalTime = 0;

                    for (let material of materials) {
                        bookletQuestionsCount += material.questionsCount;
                        bookletTotalTime += material.time;
                    }
                    // please check the performance of these two FOR loops by replacing other method such as reduce
                    // which it seems has lower performance compared with for loop! btw its better to check the performance! :)
                    let bookletObj = Object.create({});
                    bookletObj._id = booklet._id;
                    bookletObj.title = booklet.title;
                    bookletObj.bookletMaterials = materials;
                    bookletObj.bookletQuestionsCount = bookletQuestionsCount;
                    bookletObj.bookletTotalTime = bookletTotalTime;
                    bookletArr.push(bookletObj);
                }
                let examPublish = await ExamPublish.findOne({ isDeleted: false, exam: req.params.id })
                result.examId = exam._id;
                result.title = exam.title;
                result.user = exam.user.firstName + " " + exam.user.lastName;
                result.branch = examBasic.branch.title;
                result.subBranch = examBasic.subBranch.title;
                result.group = examBasic.group.title;
                result.subGroup = examBasic.subGroup.title;
                result.bookletNumber = exam.bookletNumber;
                result.questionsCount = questionsCount;
                result.totalTime = totalTime;
                result.examCode = exam.code;
                result.booklets = bookletArr;
                result.withNegativePoint = examBasic.withNegativePoint;
                result.isPdfVersion = exam.isPdfVersion;
                result.joinTimeLimitation = examPublish.joinTimeLimitation;
                result.startTime = examPublish.startTime;
                result.registerTime = examPublish.registerTime;
                result.price = examPublish.price;
                result.withCertificate = examBasic.withCertificate;
                result.organization = examBasic.organization;
                result.organizationCode = examBasic.organizationCode;
                result.referenceFile = examBasic.referenceFile;
                result.questionMaterialCount = bookletMaterialCount;
                debug(result);
                return res.status(200).json(result);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, "examOrExamBasic"));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editExam: async function (req, res, next) {
        try {
            const {
                title,
                bookletNumber,
                isPdfVersion
            } = req.body;
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!exam) return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            let examProduction = await ExamProduction.findOne({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: false
            });
            if (examProduction && exam.bookletNumber != bookletNumber) return next(new OperationalError(INVALID_OPERATION_ERROR, "bookletNumber"));

            let materialQuestions = await MaterialQuesitons.find({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: false
            });
            let editableVersion = true;
            for (let item of materialQuestions) {
                let length = item.questions.length;
                if (length > 0) editableVersion = false;
                beark;
            }
            if (examProduction && editableVersion == false && isPdfVersion == true) return next(new OperationalError(INVALID_OPERATION_ERROR, "isPdfVersion"));

            let examPublish = await ExamPublish.findOne({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: fasle
            });
            if (examPublish && editableVersion == false && isPdfVersion == true) return next(new OperationalError(INVALID_OPERATION_ERROR, "isPdfVersion"));

            let examFactor = await ExamFactor.findOne({
                exam: req.params.id,
                isDeleted: false,
                isPaid: true
            });

            if (examFactor) return next(new OperationalError(INVALID_OPERATION_ERROR, "examFactor"));

            if (exam.isCompleted) return next(new OperationalError(INVALID_OPERATION_ERROR, "exam"));

            let editedExam = await Exam.updateOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            }, {
                title: title,
                bookletNumber: bookletNumber,
                isPdfVersion: isPdfVersion,
                updatedAt: Date.now()
            });
            return res.status(200).json(editedExam);
        } catch (error) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteExam: async function (req, res, next) {
        try {
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            })
            if (!exam) return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            let deletedExam = await Exam.updateOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            }, {
                isDeleted: true,
                updatedAt: Date.now()
            });
            return res.json(200).json(deletedExam);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteExamBasic: async function (req, res, next) {
        try {
            let examBasic = await ExamBasic.findOne({
                exam: req.params.id,
                isDeleted: false
            });
            if (!examBasic) return next(new OperationalError(NOT_FOUND_ERROR, "examBasic"));
            let editedExamBasic = await ExamBasic.updateOne({
                exam: req.params.id,
                isDeleted: false
            }, {
                isDelete: false
            });
            return res.status(200).json(editedExamBasic);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteExamProduction: async function (req, res, next) {
        try {
            let examProduction = await ExamProduction.findOne({
                exam: req.params.id,
                isDeleted: false
            });
            if (!examProduction) return next(new OperationalError(NOT_FOUND_ERROR, "examProduction"));
            let editedExamProduction = await ExamProduction.updateOne({
                exam: req.params.id,
                isDeleted: false
            }, {
                isDelete: false
            });
            return res.status(200).json(editedExamProduction);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteExamPublish: async function (req, res, next) {
        try {
            let examPublish = await ExamPublish.findOne({
                exam: req.params.id,
                isDeleted: false
            });
            if (!examPublish) return next(new OperationalError(NOT_FOUND_ERROR, "examPublish"));
            let editedExamPublish = await ExamPublish.updateOne({
                exam: req.params.id,
                isDeleted: false
            }, {
                isDelete: false
            });
            return res.status(200).json(editedExamPublish);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteExamFactor: async function (req, res, next) {
        try {
            let examFactor = await ExamFactor.findOne({
                exam: req.params.id,
                isDeleted: false
            });
            if (!examFactor) return next(new OperationalError(NOT_FOUND_ERROR, "examFactor"));
            let editedExamFactor = await ExamPublish.updateOne({
                exam: req.params.id,
                isDeleted: false
            }, {
                isDelete: false
            });
            return res.status(200).json(editedExamFactor);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteExamByAdmin: async function (req, res, next) {
        try {
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false,
            })
            if (!exam) return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            let deletedExam = await Exam.updateOne({
                _id: req.params.id,
                isDeleted: false,
            }, {
                isDeleted: true,
                updatedAt: Date.now()
            });
            return res.json(200).json(deletedExam);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editExamByAdmin: async function (req, res, next) {
        try {
            const {
                title,
                bookletNumber,
                isPdfVersion
            } = req.body;
            let exam = await Exam.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!exam) return next(new OperationalError(NOT_FOUND_ERROR, "exam"));
            let examProduction = await ExamProduction.findOne({
                exam: req.params.id,
                isDeleted: false
            });
            if (examProduction && exam.bookletNumber != bookletNumber) return next(new OperationalError(INVALID_OPERATION_ERROR, "bookletNumber"));

            let materialQuestions = await MaterialQuesitons.find({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: false
            });
            let editableVersion = true;
            for (let item of materialQuestions) {
                let length = item.questions.length;
                if (length > 0) editableVersion = false;
                beark;
            }
            if (examProduction && editableVersion == false && isPdfVersion == true) return next(new OperationalError(INVALID_OPERATION_ERROR, "isPdfVersion"));

            let examPublish = await ExamPublish.findOne({
                exam: req.params.id,
                user: req.user.id,
                isDeleted: fasle
            });
            if (examPublish && editableVersion == false && isPdfVersion == true) return next(new OperationalError(INVALID_OPERATION_ERROR, "isPdfVersion"));

            let examFactor = await ExamFactor.findOne({
                exam: req.params.id,
                isDeleted: false,
                isPaid: true
            });

            if (examFactor) return next(new OperationalError(INVALID_OPERATION_ERROR, "examFactor"));

            if (exam.isCompleted) return next(new OperationalError(INVALID_OPERATION_ERROR, "exam"));

            let editedExam = await Exam.updateOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            }, {
                title: title,
                bookletNumber: bookletNumber,
                isPdfVersion: isPdfVersion,
                updatedAt: Date.now()
            });
            return res.status(200).json(editedExam);
        } catch (error) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editExamBasic: async function (req, res, next) {
        try {
            const {
                branch,
                subBranch,
                group,
                subGroup,
                withCertificate,
                organization,
                organizationCode,
                referenceFile,
                withNegativePoint
            } = req.body;
            let examBasic = await ExamBasic.findOne({
                exam: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!examBasic) return next(new OperationalError(INVALID_OPERATION_ERROR, "examFactor"));
            let editedExamBasic = await ExamBasic.updateOne({
                isDeleted: false,
                exam: req.params.id,
                user: req.user.id
            }, {
                branch: branch,
                subBranch: subBranch,
                group: group,
                subGroup: subGroup,
                withCertificate: withCertificate,
                withCertificateAccepted: null,
                organization: organization,
                organizationAccepted: null,
                organizationCode: organizationCode,
                organizationCodeAccepted: null,
                referenceFile: referenceFile,
                referenceFileAccepted: null,
                withNegativePoint: withNegativePoint,
                isAccepted: null,
                isSent: true,
                requestSentAt: Date.now(),
                updatedAt: Date.now(),
                isEdited: true,

            });
            return res.status(200).json(editedExamBasic);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    changeExamProductionState: async function (req, res, next) {
        try {
            let examProduction = await ExamProduction.findOne({
                exam: req.params.id,
                isDelete: false,
                user: req.user.id
            });
            if (examProduction != null) {
                let changeExamProduction = await ExamProuction.updateOne({
                    exam: req.params.id,
                    isDelete: false,
                    user: req.user.id
                }, {
                    isSent: false,
                    requestSentAt: null,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    updatedAt: Date.now(),
                    isEdited: false,
                });
                return res.status(200).json(changeExamProduction);
            } else {
                return null;
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    changeExamPublishState: async function (req, res, next) {
        try {
            let examPublish = await ExamPublish.findOne({
                exam: req.params.id,
                isDelete: false,
                user: req.user.id
            });
            if (examPublish != null) {
                let changeExamPublish = await ExamPublish.updateOne({
                    exam: req.params.id,
                    isDelete: false,
                    user: req.user.id
                }, {
                    registerTimeAccepted: null,
                    registerTimeAnswered: null,
                    startTimeAccepted: null,
                    startTimeAnswered: null,
                    priceAccepted: null,
                    priceAnswered: null,
                    isSent: false,
                    requestSentAt: null,
                    isAccepted: null,
                    requestAcceptedAt: null,
                    isRejected: null,
                    requestRejectedAt: null,
                    updatedAt: Date.now(),
                    isEdited: false,
                });
                return res.status(200).json(changeExamPublish);
            } else {
                return null;
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editExamProduction: async function (req, res, next) {
        try {
            const {
                webcamActive,
                soundActive
            } = req.body;
            let examProduction = await ExamProduction.findOne({
                exam: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!examProduction) return next(new OperationalError(INVALID_OPERATION_ERROR, "examProduction"));
            let editedExamProduction = await ExamProduction.updateOne({
                isDeleted: false,
                exam: req.params.id,
                user: req.user.id
            }, {
                webcamActive: webcamActive,
                soundActive: soundActive,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isSent: true,
                requestSentAt: Date.now(),
                updatedAt: Date.now(),
                isEdited: true,

            })
            return res.status(200).json(editedExamProduction);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editExamPublish: async function (req, res, next) {
        try {
            const {
                joinTimeLimitation,
                registerTime,
                startTime,
                price
            } = req.body;
            let examPublish = await ExamPublish.findOne({
                exam: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!examPublish) return next(new OperationalError(INVALID_OPERATION_ERROR, "examPublish"));
            let editedExamProduction = await ExamPublish.updateOne({
                isDeleted: false,
                exam: req.params.id,
                user: req.user.id
            }, {
                joinTimeLimitation: joinTimeLimitation,
                registerTime: registerTime,
                startTime: startTime,
                price: price,
                registerTimeAccepted: null,
                registerTimeAnswered: null,
                registerTimeMessage: null,
                startTimeAccepted: null,
                startTimeAnswered: null,
                startTimeMessage: null,
                priceAccepted: null,
                priceAnswered: null,
                priceMessage: null,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
                isSent: true,
                requestSentAt: Date.now(),
                updatedAt: Date.now(),
                isEdited: true,

            })
            return res.status(200).json(editedExamProduction);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getQuestionsForMaterialQuestion: async function (req, res, next) {
        // 
    },
    //@api/exam/get-all
    //@get
    //@public
    //@exam-list-page
    allExams: async function (req, res, next) {
        try {
            let exams = await Exam.find({
                isCompleted: true,
                isDeleted: false
            }).sort({
                createdAt: -1
            }).populate("user");
            debug("exams", exams);
            let examInfoArr = [];
            for (let exam of exams) {
                let userExamInfo = await Object.create({});
                let examBasic = await ExamBasic.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examProduction = await ExamProduction.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examPublish = await ExamPublish.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examFactor = await ExamFactor.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });

                if (!examBasic) {
                    userExamInfo.examBasic = null;
                } else {
                    userExamInfo.examBasic = examBasic;
                }
                if (!examProduction) {
                    userExamInfo.examProduction = null;
                } else {
                    userExamInfo.examProduction = examProduction;
                }
                if (!examPublish) {
                    userExamInfo.examPublish = null;
                } else {
                    userExamInfo.examPublish = examPublish;
                }
                if (!examFactor) {
                    userExamInfo.examFactor = null;
                } else {
                    userExamInfo.examFactor = examFactor;
                }

                userExamInfo.title = exam.title;
                userExamInfo.createdAt = exam.createdAt;
                userExamInfo.isCompleted = exam.isCompleted;
                userExamInfo.code = exam.code;
                examInfoArr.push(userExamInfo);
            }
            return res.status(200).json(examInfoArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    //@api/exam/latest-exams
    //@get
    //@public
    //@exam-list-page
    geLatestExams: async function (req, res, next) {
        try {
            // let exams = await Exam.find({
            //     isCompleted: true,
            //     isDeleted: false
            // }).sort({
            //     createdAt: -1
            // }).populate("user").limit(3);
            let exams = await Exam.find({
                isCompleted: true,
                isDeleted: false
            }).sort({
                createdAt: -1
            }).populate("user");
            debug("exams", exams);
            let examInfoArr = [];
            for (let exam of exams) {
                let userExamInfo = await Object.create({});
                let examBasic = await ExamBasic.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examProduction = await ExamProduction.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examPublish = await ExamPublish.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });
                let examFactor = await ExamFactor.findOne({
                    exam: exam._id,
                    isDeleted: false,
                });

                if (!examBasic) {
                    userExamInfo.examBasic = null;
                } else {
                    userExamInfo.examBasic = examBasic;
                }
                if (!examProduction) {
                    userExamInfo.examProduction = null;
                } else {
                    userExamInfo.examProduction = examProduction;
                }
                if (!examPublish) {
                    userExamInfo.examPublish = null;
                } else {
                    userExamInfo.examPublish = examPublish;
                }
                if (!examFactor) {
                    userExamInfo.examFactor = null;
                } else {
                    userExamInfo.examFactor = examFactor;
                }

                userExamInfo.title = exam.title;
                userExamInfo.createdAt = exam.createdAt;
                userExamInfo.isCompleted = exam.isCompleted;
                userExamInfo.code = exam.code;
                examInfoArr.push(userExamInfo);
            }
            return res.status(200).json(examInfoArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    //@api/exam/suggested-latest-exams
    //@get
    //@public
    //@exam-list-page
    suggestedExams: async function (req, res, next) {
        try {

        } catch (err) {

        }
    },

    //@api/exam/high-rated-exams
    //@get
    //@public
    //@exam-list-page
    highRatedExams: async function (req, res, next) {
        try {

        } catch (err) {

        }
    },

    //@api/exam/best-seller-exams
    //@get
    //@public
    //@exam-list-page
    bestSellerExams: async function (req, res, next) {
        try {

        } catch (error) {

        }
    },

    //@api/exam/related-courses
    //@get
    //@public
    //@exam-list-page
    relatedCourses: async function (req, res, next) {
        try {

        } catch (err) {

        }
    },

    //@api/exam/related-webinars
    //@get
    //@public
    //@exam-list-page
    relatedWebinars: async function (req, res, next) {
        try {

        } catch (err) {

        }
    },

    getExamIndexCategories: async function (req, res, next) {
        try {
            let setting = await Setting.findOne({ index: 0, isDeleted: false }).select('-index').populate("examCategories").exec();
            return res.status(200).json(setting.examCategories);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    initializeExamFactorTotalPrice: async function (req, res, next) {
        try {
            let examFactor = await ExamFactor.findOne({ _id: req.params.id, isDeleted: false })
            if (!examFactor)
                return next(new OperationalError(NOT_FOUND_ERROR, "examFactor"));
            let fiscalYear = await FiscalYear.findOne({ title: SYSTEM_FISCAL_YEAR.fiscalYear, isDeleted: false });
            console.log("fiscalYear", fiscalYear)
            let salesSetting = await SalesSetting.findOne({ fiscalYear: fiscalYear._id, isDeleted: false, type: "exam" }).populate("fiscalYear");
            if (!salesSetting)
                return next(new OperationalError(NOT_FOUND_ERROR, "salesSetting"));
            let bookletMaterials = await BookletMaterial.find({ exam: examFactor.exam, isDeleted: false });
            debug("bookletMaterials", bookletMaterials);
            let questionsCount = await bookletMaterials.reduce((prev, item) => {
                return prev + item.questionsCount;
            }, 0);
            let totalPrice = parseInt(salesSetting.PricePerQuestion, 10) * questionsCount + parseInt(salesSetting.ConstantPrice, 10);
            let payablePrice = totalPrice - parseInt(salesSetting.TotalDiscount, 10);
            //console.log(salesSetting.PricePerQuestion)
            // const t = { 'totalPrice': totalPrice }
            // const y = {'y': salesSetting.PricePerQuestion}
            let updatedExamFactor = await ExamFactor.updateOne({ _id: req.params.id, isDeleted: false }, {
                totalPrice: totalPrice,
                payablePrice: payablePrice,
                examCost: salesSetting.ConstantPrice,
                totalDiscount: salesSetting.TotalDiscount,
                serverCost: parseInt(salesSetting.PricePerQuestion, 10) * questionsCount,
                questionsCount: questionsCount
            });
            return res.status(200).json(updatedExamFactor);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));

        }
    },
    getQbankInfo: async function (req, res, next) {
        try {
            const { materialId } = req.body;
            let material = await BookletMaterial.findOne({ _id: materialId, isDeleted: false });
            if (!material) return next(new OperationalError(NOT_FOUND_ERROR, "materail"));

            let lesson = material.lesson;
            let qbank = await QuestionBank.findOne({ lesson: lesson, user: req.user.id });
            if (!qbank) return next(new OperationalError(NOT_FOUND_ERROR, "qbank"));



            let hardQuestions = await Question.find({ qbank: qbank, isDeleted: false, difficulty: "hard" });
            let countHardQuestion = hardQuestions.length
            let simpleQuestions = await Question.find({ qbank: qbank, isDeleted: false, difficulty: "simple" });
            let countSimpleQuestion = simpleQuestions.length
            let result = { "simpleQuestionsCount": countSimpleQuestion, "hardQuestionsCount": countHardQuestion, "materialId": material._id };
            return res.status(200).json(result);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    }
    ,
    cloneExamProductionCollection: async function (req, res, next) {
        try {

            let deletedExamProduction = await ExamProduction.findOne({
                _id: req.params.id,
                isDeleted: true,
            });
            console.log('deletedExamProduction', deletedExamProduction)
            const deepClone = JSON.parse(JSON.stringify(deletedExamProduction));
            console.log('deepClone', deepClone)
            Object.assign(deepClone, {
                isDeleted: false,
                referenceId: deletedExamProduction.id,
                _id: mongoose.Types.ObjectId(),
                isSent: false,
                updatedAt: Date.now(),
                requestSentAt: null,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
            });
            debug("deepClone", deepClone);

            let newExamProduction = new ExamProduction(deepClone);
            await newExamProduction.save();
            return res.status(200).json(newExamProduction);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    cloneExamPublishCollection: async function (req, res, next) {
        try {

            let deletedExamPublish = await ExamPublish.findOne({
                _id: req.params.id,
                isDeleted: true,
            });
            const deepClone = JSON.parse(JSON.stringify(deletedExamPublish));
            Object.assign(deepClone, {
                isDeleted: false,
                referenceId: deletedExamPublish.id,
                _id: mongoose.Types.ObjectId(),
                isSent: false,
                updatedAt: Date.now(),
                requestSentAt: null,
                isAccepted: null,
                requestAcceptedAt: null,
                isRejected: null,
                requestRejectedAt: null,
            });
            debug("deepClone", deepClone);

            let newExamPublish = await new ExamPublish(deepClone);
            await newExamPublish.save();
            return res.status(200).json(newExamPublish);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    handleExamProductionState: async function (req, res, next) {
        try {
            let examProduction = await ExamProduction.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!examProduction) return next(new OperationalError(NOT_FOUND_ERROR, "examProduction"));
            if (req.body.isRejected) {
                let handledExamProduction = await ExamProduction.updateOne({
                    _id: req.params.id,
                    isDeleted: false
                }, {
                    isRejected: true,
                    requestRejectedAt: Date.now(),
                    isDeleted: true
                });
                return res.status(200).json(handledExamProduction);
            }
            if (req.body.isAccepted) {
                let handledExamProduction = await ExamProduction.updateOne({
                    _id: req.params.id,
                    isDeleted: false
                }, {
                    isAccepted: true,
                    requestAcceptedAt: Date.now(),
                    updatedAt: Date.now(),
                });
                return res.status(200).json(handledExamProduction);
            }
            return res.status(200).json(handledExamProduction);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    handleExamPublishState: async function (req, res, next) {
        try {
            let examPublish = await ExamPublish.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!examPublish) return next(new OperationalError(NOT_FOUND_ERROR, "examPublish"));
            if (req.body.isRejected) {
                let handledExamPublish = await ExamPublish.updateOne({
                    _id: req.params.id,
                    isDeleted: false
                }, {
                    isRejected: true,
                    requestRejectedAt: Date.now(),
                    isDeleted: true
                });
                return res.status(200).json(handledExamPublish);
            }
            if (req.body.isAccepted) {
                let handledExamPublish = await ExamPublish.updateOne({
                    _id: req.params.id,
                    isDeleted: false
                }, {
                    isAccepted: true,
                    requestAcceptedAt: Date.now(),
                });
                return res.status(200).json(handledExamPublish);
            }
            return res.status(200).json(handledExamPublish);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    pdfExaminationFinalResult: async function (req, res, next) {
        try {
            const examId = req.params.id
            let materials = await BookletMaterial.find({ exam: examId, isDeleted: false });
            let pdfAnswers = await PdfAnswer.find({ exam: examId, isDeleted: false, isMain: false });
            console.log("pdfAnswers", pdfAnswers)
            let mainAnswer = await PdfAnswer.findOne({ exam: examId, isMain: true })
            console.log("mainAnswer", mainAnswer)
            let matArr = [];
            let matAvgPercentageArr = [];
            for (let material of materials) {
                //check if pdf answer or not --> if condition
                let lesson = await Lesson.findOne({ _id: material.lesson, isDeleted: false });
                console.log("lesson", lesson)
                let lessonTitle = lesson.title
                let mainAns = mainAnswer.answers;
                let mainMatAns = mainAns.splice(0, material.questionsCount)
                let matPdfAnsArr = [];
                for (let pdfAnswer of pdfAnswers) {
                    let ans = pdfAnswer.answers;
                    console.log("ans", ans)
                    let ansLength = ans.length;
                    console.log("length", ansLength)
                    let matPdfAns = ans.splice(0, material.questionsCount);
                    let user = pdfAnswer.user;
                    let materialPureArr = [];
                    for (let i = 0; i < matPdfAns.length; i++) {
                        const answer = matPdfAns[i];
                        if (answer.q == mainMatAns[i].q && answer.a == mainMatAns[i].a) {
                            let el = { "state": 1 }
                            materialPureArr.push(el)
                        }
                        if (answer.q == mainMatAns[i].q && answer.a != mainMatAns[i].a && mainMatAns[i].a != null) {
                            let el = { "state": -1 }
                            materialPureArr.push(el)
                        }
                        if (answer.q == mainMatAns[i].q && answer.a != mainMatAns[i].a && mainMatAns[i].a == null) {
                            let el = { "state": 0 }
                            materialPureArr.push(el)
                        }
                    }
                    let examBasic = await ExamBasic.findOne({ exam: examId, isDeleted: false });
                    // console.log("examBasic", examBasic)
                    if (examBasic.withNegativePoint == true) {

                        let trueAns = materialPureArr.filter(r => r.state == 1);
                        let trueAnsCount = trueAns.length

                        let falseAns = materialPureArr.filter(r => r.state == -1);
                        let falseAnsCount = falseAns.length;

                        let percentage = 100 * (trueAnsCount * 3 - falseAnsCount) / ((materialPureArr.length) * 3)
                        matPdfAnsArr.push({ matPdfAns, materialPureArr, percentage, user })
                        matAvgPercentageArr.push(percentage)
                    }
                    if (examBasic.withNegativePoint == false) {
                        let trueAns = materialPureArr.filter(r => r.state == 1);
                        let trueAnsCount = trueAns.length


                        let percentage = 100 * (trueAnsCount) / (materialPureArr.length)
                        console.log("percentage", percentage)

                        matPdfAnsArr.push({ matPdfAns, materialPureArr, percentage, user })
                        matAvgPercentageArr.push(percentage)
                    }
                }
                console.log("matAvgPercentageArr", matAvgPercentageArr)
                let percentagSum = await matAvgPercentageArr.reduce((prev, item) => {
                    return prev + item;
                }, 0);
                console.log("percentagSum", percentagSum)
                let avg = percentagSum / (matAvgPercentageArr.length)
                console.log("matArr", matArr)
                matArr.push({ material, lessonTitle, matPdfAnsArr, mainMatAns, avg })
            }


            let itemArr = []
            for (let item of matArr) {
                console.log("item", item)
                console.log("dsd", item.matPdfAnsArr)
                let item2Arr = [];
                for (let item2 of item.matPdfAnsArr) {
                    console.log("item2", item2)
                    item2Arr.push({ "user": item2.user, "percentage": item2.percentage })
                }
                itemArr.push({ "materialId": item.material._id, "materialTitle": item.lessonTitle, "factor": item.material.factor, "item2Arr": item2Arr })
            }
            let result = []
            for (let dd of pdfAnswers) {
                console.log("ddd", dd)
                let resultArr = [];
                for (let element of itemArr) {
                    console.log("element", element)
                    let resElements = element.item2Arr;
                    let resultEl = [];
                    for (let resElement of resElements) {
                        console.log("resElement", resElement)
                        if (resElement.user == dd.user) {
                            resultEl.push({ "percentage": resElement.percentage, "factor": element.factor, "materialId": element.materialId, "materialTitle": element.materialTitle })
                        }
                    }
                    resultArr.push(resultEl)
                    console.log("resultEl", resultEl)
                }
                console.log("resultArr", resultArr)
                result.push({ "user": dd.user, "res": resultArr })
            }
            console.log("itemArr", itemArr)
            let userPercentageAvgArr = []
            for (let pdf of pdfAnswers) {
                let percentageAvgArr = [];
                for (let item of result) {
                    if (pdf.user == item.user) {
                        let userSumPercent = await item.res.reduce((prev, ac) => {
                            return prev + ac[0].percentage * ac[0].factor;
                        }, 0);
                        console.log(userSumPercent)
                        let userSumFactor = await item.res.reduce((prev, ac) => {
                            return prev + ac[0].factor;
                        }, 0);
                        let percentageAvg = userSumPercent / userSumFactor
                        console.log("percentageAvg", percentageAvg)
                        percentageAvgArr.push({ "percentageAvg": percentageAvg })
                    }
                }
                userPercentageAvgArr.push({ "user": pdf.user, "percentageAvg": percentageAvgArr })
            }
            let final = userPercentageAvgArr.sort((a, b) => {
                return b.percentageAvg[0].percentageAvg - a.percentageAvg[0].percentageAvg
            })
            let firstPlace = final[0].percentageAvg[0].percentageAvg;
            let finalRes = []
            for (let element of final) {
                let el = {};
                let foundUser = await User.findOne({ _id: element.user });
                el.user = element.user;
                el.firstName = foundUser.firstName;
                el.lastName = foundUser.lastName;
                el.percntageAvg = element.percentageAvg[0].percentageAvg;
                el.taraz = element.percentageAvg[0].percentageAvg / firstPlace * 8000 + 2000 * element.percentageAvg[0].percentageAvg / 100;
                el.rotbe = final.indexOf(element) + 1;
                finalRes.push(el)
            }

            return res.status(200).json({ itemArr, result, final, finalRes })
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    pdfExaminationResult: async function(req, res, next){
        try {
            let examId = req.params.id;
            let booklets = await Booklet.find({exam:examId, isDeleted:false});
            let bookletFinalResArr = [];
            let tarazArr = []
            for(let booklet of booklets) {
                // const bookletId = req.params.id
                // let booklet = await Booklet.findOne({_id:bookletId, isDeleted:false});
                let materials = await BookletMaterial.find({booklet:booklet._id, isDeleted:false});
                let pdfAnswers = await PdfAnswer.find({booklet: booklet._id, isDeleted:false, isMain:false});
                //console.log("pdfAnswers", pdfAnswers)
                let mainAnswer = await PdfAnswer.findOne({booklet:booklet._id, isMain: true})
                //console.log("mainAnswer", mainAnswer)
                let matArr = [];
                let matAvgPercentageArr = [];
                for (let material of materials){
                    //check if pdf answer or not --> if condition
                    let lesson = await Lesson.findOne({_id:material.lesson, isDeleted:false});
                    //console.log("lesson", lesson)
                    let lessonTitle= lesson.title
                    let mainAns = mainAnswer.answers;
                    let mainMatAns = mainAns.splice(0, material.questionsCount)
                    let matPdfAnsArr = [];
                    for(let pdfAnswer of pdfAnswers){
                        let ans = pdfAnswer.answers;
                        //console.log("ans", ans)
                        //let ansLength = ans.length;
                        //console.log("length", ansLength)
                        let matPdfAns = ans.splice(0, material.questionsCount);
                        let user = pdfAnswer.user;
                        let materialPureArr = [];
                        for (let i = 0; i < matPdfAns.length; i++) {
                            const answer = matPdfAns[i];
                            if(answer.q == mainMatAns[i].q && answer.a == mainMatAns[i].a){
                                let el = {"state": 1}
                                materialPureArr.push(el)
                            }
                            if(answer.q == mainMatAns[i].q && answer.a != mainMatAns[i].a &&  answer.a != null)
                            {
                                let el = {"state": -1}
                                materialPureArr.push(el)
                            }
                            if(answer.q == mainMatAns[i].q && answer.a != mainMatAns[i].a &&  answer.a == null)
                            {
                                let el = {"state": 0}
                                materialPureArr.push(el)
                            }
                        }
                        let examBasic = await ExamBasic.findOne({exam:booklet.exam, isDeleted:false});
                        // console.log("examBasic", examBasic)
                        if(examBasic.withNegativePoint == true){
                            
                            let trueAns = materialPureArr.filter(r => r.state == 1);
                            let trueAnsCount = trueAns.length
                            
                            let falseAns = materialPureArr.filter(r => r.state == -1);
                            let falseAnsCount = falseAns.length;
                            
                            let percentage = 100*(trueAnsCount*3 - falseAnsCount)/((materialPureArr.length)*3)
                            matPdfAnsArr.push({matPdfAns, materialPureArr, percentage, user})
                            matAvgPercentageArr.push(percentage)
                        }
                        if(examBasic.withNegativePoint == false){
                            let trueAns = materialPureArr.filter(r => r.state == 1);
                            let trueAnsCount = trueAns.length

                        
                            let percentage = 100*(trueAnsCount)/(materialPureArr.length)
                            //console.log("percentage", percentage)

                            matPdfAnsArr.push({matPdfAns, materialPureArr, percentage, user})
                            matAvgPercentageArr.push(percentage)
                        }       
                    }
                    //console.log("matAvgPercentageArr", matAvgPercentageArr)
                    let percentagSum = matAvgPercentageArr.reduce((prev, item) => {
                        return prev + item;
                    }, 0);
                    //console.log("percentagSum", percentagSum)
                    let avg = percentagSum/(matAvgPercentageArr.length)
                    //console.log("matArr", matArr)
                    matArr.push({material, lessonTitle, matPdfAnsArr, mainMatAns, avg})
                }
                


                let itemArr = []
                for(let item of matArr){
                    //console.log("item", item)
                    //console.log("dsd", item.matPdfAnsArr)
                    let item2Arr = [];
                    for (let item2 of item.matPdfAnsArr){
                        //console.log("item2", item2)
                        item2Arr.push({user: item2.user, percentage: item2.percentage, factoredPercentage: item2.percentage*item.material.factor})
                    }
                    itemArr.push({materialId: item.material._id, materialTitle: item.lessonTitle, factor: item.material.factor, item2Arr:item2Arr})
                    //tarazArr.push({materialId: item.material._id, materialTitle: item.lessonTitle, factor: item.material.factor, usersArr:item2Arr})
                }

                let result = []
                for (let dd of pdfAnswers){
                    //console.log("ddd", dd)
                    let resultArr = [];
                    for(let element of itemArr){
                        //console.log("element", element)
                        let resElements = element.item2Arr;
                        let resultEl = [];
                        for (let resElement of resElements){
                            //console.log("resElement", resElement)
                            if(resElement.user == dd.user){
                                resultEl.push({percentage: resElement.percentage, factor: element.factor,materialId: element.materialId, materialTitle : element.materialTitle})
                            }
                        }
                        resultArr.push(resultEl)
                        //console.log("resultEl", resultEl)
                    }
                    //console.log("resultArr", resultArr)
                    result.push({user: dd.user, res: resultArr})
                }
                //console.log("itemArr", itemArr)


                let userPercentageAvgArr=[]
                for(let pdf of pdfAnswers){
                    let percentageAvgArr = [];
                    for (let item of result) {
                        if(pdf.user == item.user){
                            let userSumPercent = item.res.reduce((prev, ac) => {
                            return prev + ac[0].percentage*ac[0].factor;
                        }, 0);
                        //console.log(userSumPercent)
                        let userSumFactor = item.res.reduce((prev, ac) => {
                            return prev + ac[0].factor;
                        }, 0);
                        let percentageAvg = userSumPercent/userSumFactor
                        //console.log("percentageAvg", percentageAvg)
                        percentageAvgArr.push({percentageAvg: percentageAvg, sumFactor: userSumFactor})
                        }
                    }
                    userPercentageAvgArr.push({user: pdf.user, percentageAvg: percentageAvgArr})
                }


                let final = userPercentageAvgArr.sort((a, b)=> {
                return  b.percentageAvg[0].percentageAvg - a.percentageAvg[0].percentageAvg
                })
                let firstPlace = final[0].percentageAvg[0].percentageAvg;
                let finalRes = []
                for (let element of final){
                    let el = {};
                    let foundUser = await User.findOne({_id: element.user});
                    el.user = element.user;
                    el.firstName = foundUser.firstName;
                    el.lastName = foundUser.lastName;
                    el.percntageAvg = element.percentageAvg[0].percentageAvg;
                    el.bookletSumFactor = element.percentageAvg[0].sumFactor;
                    el.bookletTaraz = element.percentageAvg[0].percentageAvg/firstPlace*8000 + 1900;
                    el.bookletRotbe = final.indexOf(element)+1;
                    finalRes.push(el)
                }
                bookletFinalResArr.push({booklet: booklet, res: {itemArr, result, final, finalRes}})
                
            }

            // for(let item of bookletFinalResArr){
            //     for(let res of item.res.finalRes){
            //         let el = {};
                    
            //         el.user = res.user;
            //             el.firstName = res.firstName;
            //             el.lastName = res.lastName;
            //             el.totalPercentage = res.percntageAvg* res.bookletSumFactor
            //             tarazArr.push(el)
                    
            //     }
            // }
            
            // let orders = await Order.find({exam:req.params.id, isPaid:true});
            // let ff = []
            // for(let order of orders){
            //     let filtered = tarazArr.filter(function(el) {
            //         console.log(el.user)
            //       });
            //    console.log("filtered",filtered)
            // }

            return res.status(200).json(bookletFinalResArr);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    getExamBookletsByBookletId: async function (req, res, next) {
        try {
            let bookletId = req.params.id;
            let booklet = await Booklet.findOne({ _id: bookletId, isDeleted: false });
            if (!booklet)
                return next(new OperationalError(NOT_FOUND_ERROR, "booklet"));

            let booklets = await Booklet.find({ exam: booklet.exam, isDeleted: false });
            let bookletArr = []
            for (let item of booklets) {
                bookletArr.push(item._id);
            }
            return res.status(200).json(bookletArr)
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));

        }
    }

};

export default examController;