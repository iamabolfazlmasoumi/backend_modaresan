import express from 'express';
// Call ExamController
import ExaminationController from '../../controllers/examination';
import authMiddleware from '../middlewares/auth';
import {
    completeExaminationStepValidation,
    createAnswerSheetValidation,
    editAnswerSheetValidation,
    showBookletValidation,
    showExaminationValidation
} from "../validations/examination";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// EXamination Routes
router.get('/exam/:id', authMiddleware.authenticateToken, showExaminationValidation, ExaminationController.showExaminationInfo);
router.get('/booklets/:id', authMiddleware.authenticateToken, showBookletValidation, ExaminationController.showBookletData);
router.put('/booklets/:id', authMiddleware.authenticateToken, completeExaminationStepValidation, ExaminationController.completeExaminationStep);
router.put('/booklets/:id/pdf', authMiddleware.authenticateToken, ExaminationController.completeExaminationPdfStep);
router.post('/booklets/:id/answer-sheet', authMiddleware.authenticateToken, createAnswerSheetValidation, ExaminationController.createAnswerSheet);
router.put('/booklets/:id/answer-sheet', authMiddleware.authenticateToken, editAnswerSheetValidation, ExaminationController.updateAnswerSheet);
router.get('/booklets/:id/answer-sheet', authMiddleware.authenticateToken, ExaminationController.getAnswerSheet);
router.get('/booklet/:id/check-next-booklet', ExaminationController.checkNextBooklet)
// router.get('/exam/:id/result', ExaminationController.examinationPdfResults);
export default router;