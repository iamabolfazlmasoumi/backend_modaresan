import express from 'express';
import authMiddleware from '../middlewares/auth';
// Call examController
import examController from '../../controllers/exam';
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

router.put('/:id/request', authMiddleware.authenticateToken, checkAccessControl('teacher__send_exam_basic_production_request'), examController.sendExamProductionRequest);
router.get('/:id/admin',checkAccessControl('admin__get_exam_production_reqeust_by_id'), examController.getExamProductionRequestByIdForAdmin)
router.get('/admin', checkAccessControl('admin_get_exam_production_requests'), examController.getExamProductionRequestsForAdmin);
router.put( '/:id/state', examController.handleExamProductionState );
router.post('/:id', examController.cloneExamProductionCollection);

export default router;