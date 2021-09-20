import express from "express";
// Call examController
import examController from "../../controllers/exam";
import orderController from "../../controllers/order";
import {
    createBookletValidation,
    createExamBasicValidation,
    createExamFactorValidation,
    createExamProductionValidation,
    createExamPublishValidation,
    createExamValidation,
    getExamBookletValidation,
    getExamFactorValidation,
    getExamProductionValidation,
    getExamPublishValidation,
    getExamValidation,
    setToCompletedExamProcedureValidation,
} from "../validations/exam";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// EXam Routes
// Make new Exam
router.post("/", createExamValidation, checkAccessControl('teacher__create_exam'), examController.createExam);

//router.get("/:id", examController.showExamInfo);

// Exam Basic info step
router.get("/:id/exam-basic", getExamValidation, checkAccessControl('teacher__get_exam'), examController.showExamBasic);
router.post(
    "/:id/exam-basic",
    createExamBasicValidation,
    checkAccessControl('admin__create_exam_basic'),
    examController.createExamBasic
);
router.post(
    "/:id/booklet",
    createBookletValidation,
    checkAccessControl('teacher__create_booklet'),
    examController.createBooklet
);
router.get(
    "/:id/booklet",
    getExamBookletValidation,
    checkAccessControl('teacher__get_exam_booklet'),
    examController.ShowBookletsOfExam
);
router.get("/:id/materials", checkAccessControl('teacher_get_booklet_material'), examController.getBookletMaterialsOfExam);

// Exam Production Step
// ExamBasic accepted by Admin => Then by clicking the accept button, the initial createExamProduction will be executed for User
router.post(
    "/:id/exam-production",
    createExamProductionValidation,
    checkAccessControl('teacher__create_exam_production'),
    examController.createExamProduction
);
router.get(
    "/:id/exam-production",
    getExamProductionValidation,
    checkAccessControl('teacher__get_exam_production'),
    examController.showExamProduction
);

// Exam Production Step accepted by Admin => Then by clicking the accept button, the initial createExamPublish will be executed for User
router.post(
    "/:id/exam-publish",
    createExamPublishValidation,
    checkAccessControl('teacher__create_exam_publish'),
    examController.createExamPublish
);
router.get(
    "/:id/exam-publish",
    getExamPublishValidation,
    checkAccessControl('teacher__get_exam_publish'),
    examController.showExamPublish
);

// Exam Publish Step accepted by Admin => Then by clicking the accept button, the initial createExamFactor will be executed for User
router.post(
    "/:id/exam-factor",
    createExamFactorValidation,
    checkAccessControl('teacher__create_exam_factor'),
    examController.createExamFactor
);
router.get(
    "/:id/exam-factor",
    getExamFactorValidation,
    checkAccessControl('teacher__get_exam_factor'),
    examController.showExamFactor
);
router.put(
    "/:id",
    setToCompletedExamProcedureValidation,
    checkAccessControl('teacher__complete_exam_production'),
    examController.setToCompletedExamProcedure
);
router.get("/:id/exam-detail", checkAccessControl('teacher__get_exam_detail'), examController.getExamDetail);

router.get("/exams-list/uncompleted", checkAccessControl('teacher__get_exam'), examController.getUncompletedExamsList);

router.post("/special-exam", examController.createSpecialExam);

router.get("/special-exam", examController.SpecialExamList);

router.get("/special-exam/schedule", examController.getSlotSchedule);

router.put("/special-exam/status", examController.changeSpecialExamStatus);

router.put("/special-exam/:id/deactivate", examController.deActivateSpecialExam);

router.get("/:id/admin", checkAccessControl('admin__get_exam_by_id_for_admin'), examController.getExamByIdForAdmin);

router.get("/:id/admin/booklets", checkAccessControl('admin__get_booklets_of_exam_for_admin'), examController.getBookletsOfExamForAdmin);

router.put("/:id", checkAccessControl('teacher__edit_exam'), examController.editExam);

router.put("/:id/admin-edit", checkAccessControl('edmin__edit_exam'), examController.editExamByAdmin);

router.put("/:id/delete", checkAccessControl('teacher__deleteExam'),examController.deleteExam);

router.put("/:id/exam-basic/delete", checkAccessControl('teacher__delete_exam_basic'), examController.deleteExamBasic);

router.put("/:id/exam-production/delete", checkAccessControl('teacher__delete_exam_production'), examController.deleteExamProduction);

router.put("/:id/exam-publish/delete",checkAccessControl('teacher__delete_exam_publish'), examController.deleteExamPublish);

router.put("/:id/exam-factor/delete", checkAccessControl('teacher__delete_exam_factor'), examController.deleteExamFactor);

router.put("/:id/exam-production/chage-state",checkAccessControl('teacher__change_exam_production_state'), examController.changeExamProductionState);

router.put("/:id/exam-publish/chage-state",checkAccessControl('teacher__change_exam_publish_state'), examController.changeExamPublishState);

router.get("/admin/exam-list", examController.showExamListForAdmin);
router.get( "/", examController.showExamList );
router.get("/student-exam-list", examController.showStudentExamList)
router.get("/:id/pdf-results", examController.pdfExaminationFinalResult);
router.get("/:id/pdf-examination-results", examController.pdfExaminationResult);
router.get("/booklet/:id/exam-booklets", examController.getExamBookletsByBookletId)

export default router;