import express from 'express';
// validation
import {createTextbookValidation, getTextbookValidation} from "../validations/option";

// controllers
import questionBankController from '../../controllers/question-bank';
import examController from '../../controllers/exam';
import {
    addOptionToQuestionValidation,
    addQuestionToBankValidation,
    createAnswerValidation,
    createOptionValidation,
    getAnswerValidation,
    getOptionValidation,
    getQuestionValidation
} from "../validations/question";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes

router.get('/:id', getQuestionValidation, checkAccessControl('teacher__get_answer'), questionBankController.showQuestion);
router.post('/:id/answer', createAnswerValidation, checkAccessControl('teacher__create_answer'), questionBankController.createAnswer);
router.get('/:id/answer', getAnswerValidation, checkAccessControl('teacher__get_answer'), questionBankController.showAnswer);
router.post('/:id/option', createOptionValidation, checkAccessControl('teacher__create_question'), questionBankController.createOption);
router.get('/:id/options', getOptionValidation, checkAccessControl('teacher__get_option'), questionBankController.optionsList);
router.post('/:id/textbook', createTextbookValidation, checkAccessControl('teacher__create_textbook'), questionBankController.createTextBook);
router.get('/:id/textbook', getTextbookValidation, checkAccessControl('teacher__get_textbook'), questionBankController.showTextbook);
router.put('/:id/question-bank', addQuestionToBankValidation, checkAccessControl('teacher__add_question_to_bank'), examController.addQuestionToBank); // in exam publish procedure
router.post('/:id/add-option', addOptionToQuestionValidation, checkAccessControl('teacher__add_option_to_question'), examController.addOptionToQuestion); // in exam publish procedure

export default router;