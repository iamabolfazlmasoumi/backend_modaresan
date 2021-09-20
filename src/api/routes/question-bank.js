import express from 'express';
import authMiddleware from '../middlewares/auth';
// controllers
import questionBankController from '../../controllers/question-bank';
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post('/:id/question', authMiddleware.authenticateToken, checkAccessControl('teacher__create_question'), questionBankController.createQuestion);
router.get('/', authMiddleware.authenticateToken, checkAccessControl('teacher__get_question_bank'), questionBankController.userQuestionBanksList);
router.get('/:id/questions', authMiddleware.authenticateToken, checkAccessControl('teacher__create_question_bank'), questionBankController.userQuestionBankQuestions);
router.get('/:id', authMiddleware.authenticateToken, checkAccessControl('teacher__get_question_bank'), questionBankController.showQuestionBank);

export default router