import express from 'express';
// controllers
import salesSettingController from '../../controllers/sales-setting';
// middlewares
import authMiddleware from '../middlewares/auth';
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post('/',  salesSettingController.createExamSaleSetting);
router.get('/',  salesSettingController.getThisYearsExamSalesSetting);
router.put('/:id',  salesSettingController.editExamSalesSetting);

export default router