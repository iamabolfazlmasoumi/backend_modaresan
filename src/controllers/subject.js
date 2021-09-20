// validations
import OperationalError, {
    ALREADY_EXISTS_ERROR,
    NOT_FOUND_ERROR,
} from '../api/validations/operational-error';
import ProgrammingError from '../api/validations/programmer-error';
// models
import Lesson from '../models/lesson';
import Season from '../models/season';
import Topic from '../models/topic';
import QuestionBank from '../models/question-bank';

const debug = require('debug')('app:dev');

const subjectController = {

    createLesson: async function (req, res, next) {
        try {
            const {
                title,
                fiscalYear,
                branch,
                subBranch,
                group,
                subGroup
            } = req.body;

            let lesson = await Lesson.findOne({
                title: title,
                isDeleted: false,
                user: req.user.id
            })
            if (lesson) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'lesson'));
            } else {
                const newLesson = new Lesson({
                    title: title,
                    fiscalYear: fiscalYear,
                    branch: branch,
                    subBranch: subBranch,
                    group: group,
                    subGroup: subGroup,
                    user: req.user.id,

                });
                let result = await newLesson.save();
                return res.status(200).json(result);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    lessonsList: async function (req, res, next) {
        let foundResult = [];
        try {
            let lessons = await Lesson.find({
                    isDeleted: false,
                    user: req.user.id
                })
                .populate("fiscalYear")
                .populate("branch")
                .populate("subBranch")
                .populate("group")
                .populate("subGroup")
                .populate("user");
            debug("lessons", lessons);
            for (let lesson of lessons) {
                let lessonsArr = [];
                debug("lessonsArr", lessonsArr);
                try {
                    let seasons = await Season.find({
                        lesson: lesson.id,
                        isDeleted: false,
                        user: req.user.id
                    });
                    debug("seasons", seasons);
                    for (let season of seasons) {
                        try {
                            let topics = await Topic.find({
                                season: season.id,
                                isDeleted: false,
                                user: req.user.id
                            });
                            lessonsArr.push({
                                "season": season,
                                "topics": topics
                            })
                            debug("lessonsArr", lessonsArr);
                        } catch (err) {
                            debug("err", err);
                            return next(new ProgrammingError(err.message, err.stack));
                        }

                    }
                    let qBank = await QuestionBank.findOne({
                        lesson: lesson._id,
                        isDeleted: false
                    });
                    debug("qBank", qBank);
                    foundResult.push({
                        "lesson": lesson,
                        "details": lessonsArr,
                        "questionBank": qBank
                    })
                } catch (err) {
                    debug("err", err);

                }
            }
            return res.status(200).json(foundResult);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    showLesson: async function (req, res, next) {
        try {
            let lesson = await Lesson.findOne({
                    _id: req.params.id,
                    isDeleted: false,
                    user: req.user.id
                })
                .populate("branch")
                .populate("subBranch")
                .populate("group")
                .populate("subGroup")
                .populate("fiscalYear")
                .populate("user");
            if (lesson) {

                let seasons = await Season.find({
                    lesson: lesson._id,
                    isDeleted: false
                });
                let result = [lesson, {
                    "season": seasons
                }]
                return res.status(200).json(result)

            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'lesson'));

            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editLesson: async function (req, res, next) {
        try {
            const { title, branch, subBranch, group, subGroup, fiscalYear } = req.body;
            let lesson = await Lesson.findOne({ isDeleted: false, _id: req.params.id });
            if (!lesson)
                return next(new OperationalError(NOT_FOUND_ERROR, 'lesson'));
            let updatedLesson = await Lesson.updateOne({ _id: req.params.id, isDeleted: false}, {
                title: title,
                branch: branch,
                subBranch: subBranch,
                group: group,
                subGroup: subGroup,
                fiscalYear:fiscalYear
            });
            return res.status(200).json(updatedLesson);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createSeasonForLesson: async function (req, res, next) {
        try {
            const {
                title,
                lesson
            } = req.body;
            let season = await Season.findOne({
                lesson: lesson,
                user: req.user.id,
                isDeleted: false,
                title: title
            });
            if (season) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'season'));

            } else {
                const newSeason = new Season({
                    title: title,
                    lesson: lesson,
                    user: req.user.id,
                });
                await newSeason.save();
                return res.status(200).json(newSeason);
            }

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }

    },
    seasonsList: async function (req, res, next) {
        try {
            let seasons = await Season.find({
                    lesson: req.params.id,
                    isDeleted: false,
                    user: req.user.id
                })
                .populate("lesson")
                .populate("user");
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));

        }
    },
    editSeason: async function (req, res, next) {
        try {
            const { title, lesson } = req.body;
            let season = await Season.findOne({ isDeleted: false, _id: req.params.id });
            if (!season)
                return next(new OperationalError(NOT_FOUND_ERROR, 'season'));
            let updatedSeason = await Season.updateOne({ _id: req.params.id, isDeleted: false}, {
                title: title,
                lesson:lesson
            });
            return res.status(200).json(updatedSeason);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createTopicForSeason: async function (req, res, next) {
        try {
            const {
                title,
                season
            } = req.body;
            let topic = await Topic.findOne({
                season: season,
                user: req.user.id,
                isDeleted: false,
                title: title
            });
            if (topic) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'topic'));

            } else {
                const newTopic = new Topic({
                    title: title,
                    season: season,
                    user: req.user.id
                });
                await newTopic.save();
                return res.status(200).json(newTopic);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));

        }
    },
    topicsList: async function (req, res, next) {
        try {
            let topics = await Topic.find({
                    season: req.params.id,
                    isDeleted: false,
                    user: req.user.id
                })
                .populate("season")
                .populate("user");
            if (topics) {
                return res.status(200).json(topics);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'topics'));

            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));

        }
    },
    showSeason: async function (req, res, next) {
        try {
            let season = await Season.findOne({
                    _id: req.params.id,
                    isDeleted: false,
                    user: req.user.id
                })
                .populate("lesson")
                .populate("user");
            if (season) {
                return res.status(200).json(season)
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'season'));

            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));

        }
    },
    showTopic: async function (req, res, next) {
        try {
            let topic = await Topic.findOne({
                    _id: req.params.id,
                    isDeleted: false,
                    user: req.user.id
                })
                .populate("season")
                .populate("user");
            if (topic) {
                return res.status(200).json(topic)
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'lesson'));

            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editTopic: async function (req, res, next) {
        try {
            const { title, season } = req.body;
            let topic = await Topic.findOne({ isDeleted: false, _id: req.params.id });
            if (!topic)
                return next(new OperationalError(NOT_FOUND_ERROR, 'topic'));
            let updatedTopic = await Topic.updateOne({ _id: req.params.id, isDeleted: false}, {
                title: title,
                season:season
            });
            return res.status(200).json(updatedTopic);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },


}

export default subjectController;