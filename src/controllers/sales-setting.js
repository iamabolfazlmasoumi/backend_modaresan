import { SYSTEM_FISCAL_YEAR } from '../../config';
// Validations

// Models
import SalesSetting from '../models/sales-setting';
import FiscalYear  from '../models/fiscal-year';
import ProgrammingError from "../api/validations/programmer-error";
import OperationalError, {NOT_FOUND_ERROR, ALREADY_EXISTS_ERROR} from "../api/validations/operational-error";

const SalesSettingController = {

    createExamSaleSetting: async function (req, res, next) {
        try
        {
            const { PricePerAttendant, PricePerQuestion, ConstantPrice, SystemSalesPortion, fiscalYear, TotalDiscount } = req.body;
            let salesSetting = await SalesSetting.findOne( { fiscalYear: fiscalYear, isDeleted:false, type: "exam" } );
            if ( salesSetting )
                return next(new OperationalError(ALREADY_EXISTS_ERROR, "salesSetting")); 
            let newSalesSetting = new SalesSetting( {
                PricePerAttendant: PricePerAttendant,
                PricePerQuestion: PricePerQuestion,
                ConstantPrice: ConstantPrice,
                SystemSalesPortion: SystemSalesPortion,
                TotalDiscount: TotalDiscount,
                type: "exam",
                fiscalYear: fiscalYear
            } );
            await newSalesSetting.save();
            return res.status(200).json(newSalesSetting)
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editExamSalesSetting: async function ( req, res, next ) {
        try {
             const { PricePerAttendant, PricePerQuestion, ConstantPrice, SystemSalesPortion, TotalDiscount } = req.body;
            let salesSetting = await SalesSetting.findOne( { isDeleted:false, type: "exam", _id:req.params.id } );
            if ( !salesSetting )
                return next(new OperationalError(NOT_FOUND_ERROR, "salesSetting")); 
            let updatedSalesSetting = await SalesSetting.updateOne( {isDeleted:false, type: "exam", _id: req.params.id}, {
                PricePerAttendant: PricePerAttendant,
                PricePerQuestion: PricePerQuestion,
                ConstantPrice: ConstantPrice,
                SystemSalesPortion: SystemSalesPortion,
                TotalDiscount: TotalDiscount,
                type: "exam",
            }) 
            return res.status( 200 ).json( updatedSalesSetting );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getThisYearsExamSalesSetting: async function ( req, res, next ) {
        try
        {
            let fiscalYear = await FiscalYear.findOne( { title: SYSTEM_FISCAL_YEAR.fiscalYear, isDeleted: false } );
            
            let salesSetting = await SalesSetting.findOne( { fiscalYear: fiscalYear._id, isDeleted: false, type: "exam" } ).populate("fiscalYear");
             if ( !salesSetting )
                return next( new OperationalError( NOT_FOUND_ERROR, "salesSetting" ) );
            return res.status( 200 ).json( salesSetting );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
            
        }
    }
    
};
export default SalesSettingController;