import express from 'express';
import authMiddleware from '../middlewares/auth';
// controller
import questionBankController from '../../controllers/question-bank';
import {checkAccessControl} from "../middlewares/access-control";
import examController from '../../controllers/exam';

const router = express.Router();

router.get('/:id', authMiddleware.authenticateToken, checkAccessControl('teacher__get_option'), questionBankController.showOption);
router.get('/', checkAccessControl('teacher__get_option_list'), examController.getOptionList);

export default router
