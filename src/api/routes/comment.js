import express from "express";
//controllers
import commentController from "../../controllers/comment";

//middleware
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

//routes
router.post("/exams/:id", commentController.createExamComment);
router.get( '/:id/admin', checkAccessControl("admin:get_comment_for_admin"), commentController.getCommentForAdmin );
router.put( '/accept', checkAccessControl("admin:accept_comment"), commentController.acceptComment );
router.put( '/reject', checkAccessControl("admin:reject_comment"), commentController.rejectComment );
router.put( '/delete', checkAccessControl("admin:delete_comment"), commentController.deleteComment );
router.get( '/exam', checkAccessControl("admin:get_all_comments_with_exam_type"), commentController.getAllCommentsWithExamType );
router.get( '/user/:id', commentController.getUserExamCommentList );
export default router;