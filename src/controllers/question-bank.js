import randomstring from 'randomstring';

// validations
import OperationalError, {
    ALREADY_EXISTS_ERROR,
    INVALID_OPERATION_ERROR,
    NOT_FOUND_ERROR
} from '../api/validations/operational-error';
import ProgrammingError from '../api/validations/programmer-error';
// models
import Question from '../models/question';
import Option from '../models/option';
import TextBook from '../models/textbook';
import Answer from '../models/answer';
import QuestionBank from '../models/question-bank';
import Lesson from '../models/lesson';
import question from '../models/question';

const debug = require('debug')('app:dev');


const questionBankController = {
    createQuestionBank: async function (req, res, next) {
        try {
            let qBank = await QuestionBank.findOne({
                lesson: req.body.lesson,
                user: req.user.id,
                isDeleted: false
            }).exec();
            debug("qBank", qBank);
            if (qBank) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'qBank'));
            } else {
                let qBankLesson = await Lesson.findOne({
                    _id: req.body.lesson,
                    isDeleted: false
                }).exec();
                debug("qBankLesson", qBankLesson);
                if (qBankLesson) {
                    const newBank = new QuestionBank({
                        title: qBankLesson.title,
                        user: req.user.id,
                        lesson: req.body.lesson,
                    });
                    await newBank.save();
                    debug("newBank", newBank);
                    return res.status(200).json(newBank);
                } else {
                    return next(new OperationalError(NOT_FOUND_ERROR, 'qBankLesson'));
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    userQuestionBanksList: async function (req, res, next) {
        try {
            let qbanks = await QuestionBank.find({
                user: req.user.id,
                isDeleted: false
            }).populate("user").populate("lesson");
            return res.status(200).json(qbanks);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showQuestionBank: async function (req, res, next) {
        try {
            let qbank = await QuestionBank.findOne({
                _id: req.params.id,
                user: req.user.id,
                isDeleted: false
            }).populate("user").populate("lesson");
            if (qbank) {
                return res.status(200).json(qbank)
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'qbank'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    createQuestion: async function (req, res, next) {
        try {
            let qbank = await QuestionBank.findOne({
                _id: req.params.id,
                user: req.user.id,
                isDeleted: false
            }).populate("lesson").populate("user");
            if (!qbank) {
                return next(new OperationalError(NOT_FOUND_ERROR, 'qbank'));
            } else {
                const {
                    text,
                    type,
                    optionsCount,
                    resource,
                    season,
                    topic,
                    fiscalYear,
                    image,
                    difficulty
                } = req.body;
                let lesson = qbank.lesson;
                if (req.body.type == 1) {
                    const newQuestion = new Question({
                        text: text,
                        code: randomstring.generate({
                            length: 10,
                            charset: 'alphanumeric',
                        }),
                        type: 1,
                        optionsCount: 0,
                        difficulty: difficulty,
                        qbank: req.params.id,
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
                if (req.body.type == 2 || req.body.type == 3) {

                    const newQuestion = new Question({
                        text: text,
                        code: randomstring.generate({
                            length: 10,
                            charset: 'alphanumeric',
                        }),
                        type: type,
                        optionsCount: optionsCount,
                        difficulty: difficulty,
                        resource: resource,
                        qbank: req.params.id,
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
    userQuestionBankQuestions: async function (req, res, next) {
        try {
            let qbank = await QuestionBank.findOne({
                _id: req.params.id,
                user: req.user.id,
                isDeleted: false
            }).populate("lesson").populate("user");
            if (!qbank) {
                return next(new OperationalError(NOT_FOUND_ERROR, 'qbank'));
            } else {
                let questions = await Question.find({
                        qbank: req.params.id
                    })
                    .populate("user")
                    .populate("qbank")
                    .populate("lesson")
                    .populate("season")
                    .populate("topic")
                    .populate("fiscalYear");
                return res.status(200).json(questions);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    createOption: async function (req, res, next) {
        // type =1 not multiple choice and could have any point, type =2 is multiple choice but all the points have a point =1 , type =3 is multiple choice but every option could have any point
        try {
            let question = await Question.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            let type = question.type;
            let optionsCounted = question.optionsCount;

            switch (type) {
                case 1: {
                    return next(new OperationalError(INVALID_OPERATION_ERROR, 'createOption'));
                }
                case 2: {
                    const {
                        text,
                        image,
                        isCorrect
                    } = req.body;
                    let optionsAdded = await Option.find({
                        question: req.params.id,
                        isDeleted: false
                    }).count();
                    if (optionsAdded < optionsCounted) {
                        let correctOptions = await Option.find({
                            question: req.params.id,
                            isCorrect: true,
                            isDeleted: false
                        }).count();
                        if (correctOptions > 0 && req.body.isCorrect == true) {
                            return next(new OperationalError(INVALID_OPERATION_ERROR, 'correctOptions'));
                        }
                        if (optionsAdded == (optionsCounted - 1)) {
                            if (correctOptions == 0 && req.body.isCorrect == false) {
                                return next(new OperationalError(INVALID_OPERATION_ERROR, 'correctOptions'));
                            } else {

                                const newOption = new Option({
                                    text: text,
                                    image: image,
                                    isCorrect: isCorrect,
                                    point: 1,
                                    question: req.params.id,
                                    user: req.user.id,
                                });
                                await newOption.save()
                                return res.status(200).json(newOption);
                            }
                        } else {
                            const newOption = new Option({
                                text: text,
                                image: image,
                                isCorrect: isCorrect,
                                point: 1,
                                question: req.params.id,
                                user: req.user.id
                            });
                            await newOption.save();
                            return res.status(200).json(newOption);
                        }
                    } else {
                        return next(new OperationalError(INVALID_OPERATION_ERROR, 'createOption'));
                    }
                }
                case 3: {
                    const {
                        text,
                        image,
                        point
                    } = req.body;
                    let optionsAdded = await Option.find({
                        question: req.params.id,
                        isDeleted: false
                    }).count();
                    if (optionsAdded < optionsCounted) {
                        const newOption = new Option({
                            text: text,
                            image: image,
                            isCorrect: true,
                            point: point,
                            question: req.params.id,
                            user: req.user.id
                        });
                        await newOption.save();
                        return res.status(200).json(newOption);
                    } else {
                        return next(new OperationalError(INVALID_OPERATION_ERROR, 'createOption'));
                    }
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    optionsList: async function (req, res, next) {
        try {

            let options = await Option.find({
                    question: req.params.id,
                    isDeleted: false
                })
                .populate("question").populate("user");
            return res.status(200).json(options);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showOption: async function (req, res, next) {
        try {
            let option = await Option.findOne({
                _id: req.params.id,
            }).populate("question").populate("user");
            if (option) {
                return res.status(200).json(option);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'option'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    createTextBook: async function (req, res, next) {
        try {
            let textbook = await TextBook.findOne({
                question: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!textbook) {
                const {
                    text,
                    image
                } = req.body
                const newTextBook = new TextBook({
                    text: text,
                    image: image,
                    question: req.params.id,
                    user: req.user.id
                });
                await newTextBook.save();
                return res.status(200).json(newTextBook);
            } else {
                return next(new OperationalError(INVALID_OPERATION_ERROR, 'textbook'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    showTextbook: async function (req, res, next) {
        try {
            let textbook = await TextBook.findOne({
                question: req.params.id,
                isDeleted: false,
                user: req.user.id
            }).populate("question").populate("user");
            if (textbook) {
                return res.status(200).json(textbook);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'textbook'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    createAnswer: async function (req, res, next) {
        try {
            let question = await Question.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!question) {
                return next(new OperationalError(NOT_FOUND_ERROR, 'textbook'));
            } else {
                let answerFound = await Answer.findOne({
                    question: req.params.id
                });
                if (answerFound) {
                    return next(new OperationalError(ALREADY_EXISTS_ERROR, 'answerFound'));
                } else {
                    const {
                        text,
                        image
                    } = req.body;
                    const newAnswer = new Answer({
                        text: text,
                        image: image,
                        question: req.params.id,
                        user: req.user.id,
                    });
                    await newAnswer.save()
                    return res.status(200).json(newAnswer);
                }
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showAnswer: async function (req, res, next) {
        try {
            let question = await Question.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!question) {
                return next(new OperationalError(NOT_FOUND_ERROR, 'question'));
            } else {
                let answer = await Answer.findOne({
                    question: req.params.id,
                    isDeleted: false,
                    user: req.user.id
                }).populate("question").populate("user");
                return res.status(200).json(answer)
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showQuestion: async function (req, res, next) {
        try {
            let question = await Question.findOne({
                    _id: req.params.id,
                    isDeleted: false,
                    user: req.user.id
                })
                .populate("user")
                .populate("qbank")
                .populate("lesson")
                .populate("season")
                .populate("topic")
                .populate("fiscalYear");
            if (!question) {
                return next(new OperationalError(NOT_FOUND_ERROR, 'question'));
            } else {
                return res.status(200).json(question);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },

    editQuestion: async function (req, res, next) {
        try {
            const { text, difficulty, resource, image, season, topic } = req.body;
            let question = await Question.findOne({
                qbank: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!question) return next(new OperationalError(NOT_FOUND_ERROR, 'question'));
            let editedQuestion = await Question.updateOne({
                qbank: req.params.id,
                isDeleted: false,
                user: req.user.id
            }, {
                text: text,
                image: image,
                updatedAt: Date.now()
            });
            return res.status(200).json(editedQuestion);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editOption: async function (req, res, next) {
        try {
            const { text, point, image } = req.body;
            let option = await Option.findOne({ question: req.params.id, isDeleted: false });
            if (!option) return next(new OperationalError(NOT_FOUND_ERROR, 'option'));
            let editedOption = await Option.updateOne({ question: req.params.id, isDeleted: false }, {
                text: text,
                point: point,
                image: image,
                updatedAt: Date.now()
            });
            return res.status(200).json(editedOption);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editAnswer: async function (req, res, next) {
        try {
            const { text, image } = req.body;
            let answer = await Answer.findOne({ question: req.params.id, isDeleted: false, user:req.user.id });
            if (!answer) return next(new OperationalError(NOT_FOUND_ERROR, 'answer'));
            let editedAnswer = await Answer.updateOne({ question: req.params.id, isDeleted: false }, {
                text: text,
                image: image,
                updatedAt: Date.now()
            });
            return res.status(200).json(editedAnswer);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editTextBook: async function (req, res, next) {
        try {
            const { text, image } = req.body;
            let textbook = await TextBook.findOne({ question: req.params.id, isDeleted: false });
            if (!textbook) return next(new OperationalError(NOT_FOUND_ERROR, 'textbook'));
            let editedTextbook = await TextBook.updateOne({ question: req.params.id, isDeleted: false }, {
                text: text,
                image: image,
                updatedAt: Date.now()
            });
            return res.status(200).json(editedTextbook);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    textbooksList: async function (req, res, next) {
        try {
            let textbooks = await TextBook.find({ question: req.params.id, isDeleted: false });
            return res.status(200).json(textbooks);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editQuesitonBank: async function (req, res, next) {
        try {
            const { title } = req.body;
            let qbank = await QuestionBank.findOne({ _id: req.params.id, isDeleted: false });
            if (!qbank) return next(new OperationalError(NOT_FOUND_ERROR, 'qbank'));
            editedQbank = await QuestionBank.updateOne({ _id: req.params.id, isDeleted: false }, {
                title: title,
            });
            return res.status(200).json(editedQbank);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteQuestion: async function (req, res, next) {
        try {
            let question = await Question.findOne({ _id: req.params.id, isDeleted: false });
            if (!question) return next(new OperationalError(NOT_FOUND_ERROR, 'question'));
            let deletedQuestion = await Question.updateOne({ _id: req.params.id, isDeleted: false}, {
                isDeleted:false
            });
            return res.status(200).json(deletedQuestion);
            
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteOption: async function (req, res, next) {
        try {
            let option = await Option.findOne({ _id: req.params.id, isDeleted: false });
            if (!option) return next(new OperationalError(NOT_FOUND_ERROR, 'option'));
            let deletedOption = await Option.updateOne({ _id: req.params.id, isDeleted: false}, {
                isDeleted:false
            });
            return res.status(200).json(deletedOption);
            
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteAnswer: async function (req, res, next) {
         try {
            let answer = await Answer.findOne({ _id: req.params.id, isDeleted: false });
            if (!answer) return next(new OperationalError(NOT_FOUND_ERROR, 'answer'));
            let deletedAnswer = await Answer.updateOne({ _id: req.params.id, isDeleted: false}, {
                isDeleted:false
            });
            return res.status(200).json(deletedAnswer);
            
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteBooklet: async function (req, res, next) {
        try {
            let booklet = await Booklet.findOne({ _id: req.params.id, isDeleted: false });
            if (!booklet) return next(new OperationalError(NOT_FOUND_ERROR, 'booklet'));
            let deletedBooklet = await Booklet.updateOne({ _id: req.params.id, isDeleted: false}, {
                isDeleted:false
            });
            return res.status(200).json(deletedBooklet);
            
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteTextBook: async function (req, res, next) {
        try {
            let textbook = await TextBook.findOne({ _id: req.params.id, isDeleted: false });
            if (!textbook) return next(new OperationalError(NOT_FOUND_ERROR, 'textbook'));
            let deletedTextBook = await TextBook.updateOne({ _id: req.params.id, isDeleted: false}, {
                isDeleted:false
            });
            return res.status(200).json(deletedTextBook);
            
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
}

export default questionBankController;