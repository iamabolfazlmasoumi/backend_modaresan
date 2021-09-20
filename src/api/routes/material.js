import express from 'express';
// Call examController
import examController from '../../controllers/exam';
import {
    createMaterialValidation,
    createQuestionValidation,
    getQuestionBankValidation,
    getRandomQuestionValidation,
    updateQuestionBankValidation
} from "../validations/material";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();


router.post('/:id/material-question', createMaterialValidation, checkAccessControl('teacher__create_exam_material_questions'), examController.createMaterialQuestions);
router.get('/:id/question-bank', getQuestionBankValidation, checkAccessControl('teacher__get_bank_for_material_question'), examController.showBankForMaterialQuestions);
router.put('/:id/question', updateQuestionBankValidation, checkAccessControl('teacher__add_question_to_material'), examController.addQuestionToMaterial);
router.post('/:id/select-random-questions', getRandomQuestionValidation, checkAccessControl('teacher__select_random_question'), examController.selectRandomQuestion);
router.post('/:id/define-question', createQuestionValidation, checkAccessControl('teacher__define_new_question'), examController.defineNewQuestion); // reconsider ! we are creating new question for lesson so this route must be reconsidered
router.get('/:id/material-question',checkAccessControl('teacher__get_material_question'), examController.getMaterialQuestion);
router.get('/:id', checkAccessControl('teacher__get_booklet_material'), examController.getBookletMaterial);
router.get('/:id/questions-state', examController.getQbankInfo);
export default router;