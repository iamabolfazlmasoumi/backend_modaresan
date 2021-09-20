// validations

// models
import FiscalYear from '../models/fiscal-year';
import OperationalError, {ALREADY_EXISTS_ERROR, NOT_FOUND_ERROR} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";

const fiscalYearController = {


    createFiscalYear: async function (req, res, next) {
        try {
            const {
                title
            } = req.body;

            let fiscalYear = await FiscalYear.findOne({
                title: title,
                isDeleted: false
            });
            if (fiscalYear) {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'title'));
            }
            const newFiscalYear = new FiscalYear({
                title: title,
            });
            await newFiscalYear.save();
            return res.status(200).json(newFiscalYear);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    fiscalYearsList: async function (req, res, next) {
        try {

            let fiscalYears = await FiscalYear.find({
                isDeleted: false
            });
            if (fiscalYears) {
                return res.status(200).json(fiscalYears);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'fiscalYear'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editFiscalYear: async function (req, res, next) {
        try {
            const { title } = req.body;
            let fiscalYear = await FiscalYear.findOne({ isDeleted: false, _id: req.params.id });
            if (!fiscalYear)
                return next(new OperationalError(NOT_FOUND_ERROR, 'fiscalYear'));
            let updatedFiscalYear = await FiscalYear.updateOne({isDeleted:false, _id:req.params.id}, {
                title: title,
            });
            return res.status(200).json(updatedFiscalYear);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    }
}

export default fiscalYearController;