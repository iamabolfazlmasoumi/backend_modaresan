import express from 'express';
// Call examController
import examController from '../../controllers/exam';
import {
    cloneExamBasicCollectionValidation,
    createExamBasicRequestValidation,
    getExamBasicHistoryValidation,
    getExamBasicRequestValidation,
    getExamBasicValidation,
    handleExamBasicStateValidation,
    updateExamBasicRequestValidation
} from "../validations/exam-basic";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

router.put('/:id', createExamBasicRequestValidation, checkAccessControl('teacher__send_exam_basic_request'), examController.sendExamBasicRequest);
router.get('/:id/', getExamBasicRequestValidation, checkAccessControl('admin__get_exam_basic_request_list_By_exam_id'), examController.examBasicRequestListByExamIdForAdmin);
router.put('/:id/handle-field', checkAccessControl('admin__handle_exam_basic_field'), examController.handleExamBasicField);
router.get('/:id/show-history', getExamBasicHistoryValidation, checkAccessControl('admin__get_exam_basic_filed_history'), examController.showExamBasicFieldHistory);
router.get('/exam-basics/:id/', getExamBasicValidation, checkAccessControl('admin__get_exam_basic_request'), examController.showExamBasicRequest);
router.put('/:id/state', handleExamBasicStateValidation, checkAccessControl('admin__handle_exam_basic_state'), examController.handleExamBasicState);
router.post('/:id', cloneExamBasicCollectionValidation, checkAccessControl('admin__clone_exam_basic'), examController.cloneExamBasicCollection);
router.get('/:id',examController.examBasicRequestLisByUserIdForAdmin);
router.get('/admin',examController.examBasicRequestLisByExamId);
router.get('/:id/admin', checkAccessControl('admin__get_exam_basic_request_by_id_for_admin'),examController.getExamBasicRequestByIdForAdmin);


export default router;