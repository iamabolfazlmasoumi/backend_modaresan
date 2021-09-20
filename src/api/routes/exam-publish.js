import express from 'express';
import authMiddleware from '../middlewares/auth';
// Call examController
import examController from '../../controllers/exam';
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();


router.put('/:id/request', authMiddleware.authenticateToken, checkAccessControl('teacher__send_exam_publish'), examController.sendExamPublishRequest);
router.get('/admin', checkAccessControl('admin__get_exam_publish_requests'), examController.getExamPublishRequestsForAdmin);
router.get('/:id/admin', checkAccessControl('admin__get_exam_publish_request_by_id'), examController.getExamPublishRequestByIdForAdmin)
router.put( '/:id/state', examController.handleExamPublishState );
router.post('/:id', examController.cloneExamPublishCollection);

export default router;
