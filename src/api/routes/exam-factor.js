import express from 'express';
import authMiddleware from '../middlewares/auth';
// Call examController
import examController from '../../controllers/exam';
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();


router.put('/:id', authMiddleware.authenticateToken, checkAccessControl('teacher__set_exam_factor_paid'), examController.setExamFactorToIsPaid);
router.get('/:id/admin', checkAccessControl('admin__get_exam_factor_by_id'), examController.getExamFactorByIdForAdmin);
router.get('/admin', checkAccessControl('admin__get_exam_factors_list'),  examController.getExamFactorsListForAdmin);
router.put('/:id/total-price', examController.initializeExamFactorTotalPrice);
export default router;
