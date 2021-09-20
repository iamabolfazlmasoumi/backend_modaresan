import express from 'express';
// controllers
import fiscalYearController from '../../controllers/fiscal-year';
// middlewares
import authMiddleware from '../middlewares/auth';
import {createFiscalYearValidation} from "../validations/fiscal-year";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post('/', authMiddleware.authenticateToken, createFiscalYearValidation, checkAccessControl('admin__create_fiscal_year'), fiscalYearController.createFiscalYear);
router.get('/', authMiddleware.authenticateToken, fiscalYearController.fiscalYearsList);
router.put('/:id', fiscalYearController.editFiscalYear);

export default router