import express from "express";
import examController from "../../controllers/exam";
import uploadController from "../../controllers/upload";
import commentController from "../../controllers/comment";
import categoryController from "../../controllers/category";

const router = express.Router();


router.get( "/exams/exam-list", examController.allExams );

router.get( "/exams/latest-exams", examController.geLatestExams );

router.get( "/exams/:id", examController.getExamDetailForClient );

router.get( "/exams/:id/comment-list", commentController.getExamCommentList );

router.get("/exam-categories", examController.getExamIndexCategories);

router.get( '/booklet/:id/render-pdf', uploadController.renderBookletPdf );

router.get( '/exam/:id/render-image', uploadController.renderExamImage );

router.get('/branch', categoryController.branchesList);
router.get('/sub-branch', categoryController.subBranchesList);
router.get('/group', categoryController.groupsList);
router.get('/sub-group', categoryController.subgroupsList);



export default router;