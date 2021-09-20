import express from 'express';
// Call examController
import examController from '../../controllers/exam';
import uploadController from '../../controllers/upload';
import examinationController from '../../controllers/examination'
import {createBookletValidation, getBookletValidation} from "../validations/booklet";
import {checkAccessControl} from '../../api/middlewares/access-control'

const router = express.Router();

router.post('/:id/material',
    // createBookletValidation,
    checkAccessControl('teacher__create_booklet_material'), examController.createBookletMaterial);
router.get('/:id/material',
    // getBookletValidation,
    checkAccessControl('teacher__get_materials_of_booklet'), examController.showMaterialsOfBooklet);
router.get('/:id/admin/materials', checkAccessControl('admin__get_booklets_materials_of_exam_for_admin'), examController.getBookletMaterialsOfExamForAdmin);
router.post( '/:id/pdf-answer', examinationController.createPdfAnswer )
router.get('/:id/pdf-answer', examinationController.showPdfAnswer)
router.put( '/:id/pdf-answer', examinationController.updatePdfAnswer )
router.get( '/:id/questions-count', examinationController.getBookletQuestionsCount );
router.get( '/:id/render-pdf', uploadController.renderBookletPdf );
export default router;