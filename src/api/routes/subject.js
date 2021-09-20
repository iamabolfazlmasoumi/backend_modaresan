import express from 'express';
// middleware
// controllers
import subjectController from '../../controllers/subject';
import questionBankController from '../../controllers/question-bank';
import {
    createLessonValidation,
    createSeasonValidation,
    createTopicValidation,
    getLessonValidation,
    getSeasonValidation,
    getTopicListValidation,
    getTopicValidation
} from "../validations/subject";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post('/question-bank', checkAccessControl('teacher__create_question_bank'), questionBankController.createQuestionBank);
router.post('/lesson', createLessonValidation, checkAccessControl('teacher__create_lesson'), subjectController.createLesson);
router.get('/lessons', checkAccessControl('teacher__get_lesson_list'), subjectController.lessonsList);
router.get('/lessons/:id', getLessonValidation, checkAccessControl('teacher__get_lesson'), subjectController.showLesson);
router.post('/season', createSeasonValidation, checkAccessControl('teacher__create_season_for_lesson'), subjectController.createSeasonForLesson);
router.get('/seasons/:id', getSeasonValidation, checkAccessControl('teacher__get_season'), subjectController.showSeason);
router.post('/topic', createTopicValidation, checkAccessControl('teacher__create_topic_for_season'), subjectController.createTopicForSeason);
router.get('/topics/:id', getTopicValidation, checkAccessControl('teacher__get_topic'), subjectController.showTopic);
router.get('/:id/topics', getTopicListValidation, checkAccessControl('teacher__get_topic_list'), subjectController.topicsList);
router.get('/:id/seasons', getSeasonValidation, checkAccessControl('teacher__get_season_list'), subjectController.seasonsList);
router.put('/lesson/:id', subjectController.editLesson);
router.put('/seasons/:id', subjectController.editSeason);
router.put('/topics/:id', subjectController.editTopic);

export default router;