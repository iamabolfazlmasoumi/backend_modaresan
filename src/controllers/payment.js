import ZarinPalCheckout from 'zarinpal-checkout';

//utils
import randomstring from "randomstring";

//error handling
import OperationalError, {INVALID_OPERATION_ERROR, NOT_FOUND_ERROR} from '../api/validations/operational-error';
import ProgrammingError from '../api/validations/programmer-error';
//models
import Order from "../models/order";
import User from "../models/user";
import ExamPublish from "../models/exam-publish";
import Exam from "../models/exam";
import ExamFactor from "../models/exam-factor";
//debug
const debug = require("debug")("app:dev");
/**
 * Create ZarinPal
 * @param {String} `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` [Merchant ID]
 * @param {Boolean} false [toggle `Sandbox` mode]
 */
 const zarinpal = ZarinPalCheckout.create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);


const paymentController = {
   paymentRequest: async function (req, res, next){
      try {
        const {exam} = req.body
        console.log("examId", exam._id)
        let examFactor = await ExamFactor.findOne({exam:exam._id})
           /**
             * PaymentRequest [module]
             * @return {String} URL [Payement Authority]
             */
            zarinpal.PaymentRequest({
                Amount: examFactor.payablePrice, // In Tomans
                CallbackURL: `http://localhost:3000/userpanel/authoritypayment?Id=${exam._id}`,
                Description: examFactor.title,
               
            }).then(response => {
                if (response.status === 100) {
                  return res.status( 200 ).json( response );
                }
            }).catch(err => {
                console.error(err);
            });
      } catch (err) {
        return next(new ProgrammingError(err.message, err.stack));
          
      }
   },
   paymentVerification: async function(req, res, next){
     try
     {
       //const { amount, authority } = req.body;
       let examFactor = await ExamFactor.findOne({exam: req.params.id})
       const { authority } = req.body;
       console.log("examFactor.payablePrice", examFactor.payablePrice)
       //console.log(amount)
        let response = await zarinpal.PaymentVerification({
            Amount: examFactor.payablePrice, // In Tomans
            Authority: authority,
          });
          if (response.status !== 100) {
            return res.status( 400 ).json( { msg: "error in payment" } );
          } else {
            await ExamFactor.updateOne({exam: req.params.id},{isPaid: true, paidAt: Date.now()});
            await Exam.updateOne({_id:req.params.id}, {isCompleted: true})
            return res.status(200).json(response.RefID);
          }
    } catch (err) {
        return next(new ProgrammingError(err.message, err.stack));
        
    }
   },
  //  paymentVerification: async function(req, res, next){
  //   try
  //   {
  //     //const { amount, authority } = req.body;
  //     let examFactor = await ExamFactor.findOne({exam: req.params.id})
  //     const { authority } = req.body;
  //     console.log("examFactor.payablePrice", examFactor.payablePrice)
  //     //console.log(amount)
  //      zarinpal.PaymentVerification({
  //          Amount: examFactor.payablePrice, // In Tomans
  //          Authority: authority,
  //        }).then(response => {
  //          if (response.status !== 100) {
  //            return res.status( 400 ).json( { msg: "error in payment" } );
  //          } else {
  //            return res.status(200).json(response.RefID);
  //          }
  //        }).catch(err => {
  //          console.error(err);
  //        });
  //  } catch (err) {
  //      return next(new ProgrammingError(err.message, err.stack));
       
  //  }
  // },
   unverifiedTransactions: async function(req, res, next){
       try {
        zarinpal.UnverifiedTransactions().then(response =>
            {
                if (response.status === 100) {
                    console.log(response.authorities);
                  }
          }).catch(err => {
            console.error(err);
          });
       } catch (err) {
        return next(new ProgrammingError(err.message, err.stack));
           
       }
   },
   refreshAuthority: async function(req, res, next){
       try {
        zarinpal.RefreshAuthority({
            Authority: '000000000000000000000000000000000000',
            Expire: '1800'
          }).then(response => {
            if (response.status === 100) {
              console.log(response.status);
            }
          }).catch(err => {
            console.error(err);
          });
       } catch (err) {
        return next(new ProgrammingError(err.message, err.stack));
           
       }
   },






   examPaymentRequest: async function (req, res, next){
    try {
      const {examId} = req.body
      console.log("examId", examId)
      // exam publish register time
      let examPublish = await ExamPublish.findOne({exam: examId});
      if(!examPublish) return next(new OperationalError(NOT_FOUND_ERROR, "examPublish"));
      if(Date.now() >= examPublish.registerTime) return next(new OperationalError(INVALID_OPERATION_ERROR, "registerTime"));
      
      let examFactor = await ExamFactor.findOne({exam: examId, isPaid:true});
      if(!examFactor) return next(new OperationalError(NOT_FOUND_ERROR, "examFactor"));
         /**
           * PaymentRequest [module]
           * @return {String} URL [Payement Authority]
           */
          zarinpal.PaymentRequest({
              Amount: examPublish.price, // In Tomans
              CallbackURL: `http://localhost:3000/exams/payment-authority?Id=${examId}`,
              Description: examFactor.title,
             
          }).then(response => {
              if (response.status === 100) {
                return res.status( 200 ).json( response );
              }
          }).catch(err => {
              console.error(err);
          });
    } catch (err) {
      return next(new ProgrammingError(err.message, err.stack));
        
    }
 },
 examPaymentVerification: async function(req, res, next){
   try
   {
      const { authority } = req.body;

      let examPublish = await ExamPublish.findOne({exam: req.params.id});
      if(!examPublish) return next(new OperationalError(NOT_FOUND_ERROR, "examPublish"));

      let examFactor = await ExamFactor.findOne({exam: req.params.id});
      if(!examFactor) return next(new OperationalError(NOT_FOUND_ERROR, "examFactor"));

      let response = await zarinpal.PaymentVerification({
          Amount: examPublish.price, // In Tomans
          Authority: authority,
        });
        if (response.status !== 100) {
          return res.status( 400 ).json( { msg: "error in payment" } );
        } else {
          let user = await User.findOne({ _id: req.user.id, isDeleted: false })
          let newOrder = new Order({
            orderType: "exam",
            code: randomstring.generate({
                length: 10,
                charset: "alphanumeric",
            }),
            user: req.user.id,
            mobile:user.mobile,
            createdAt: Date.now(),
            isPaid: true,
            paidAt: Date.now(),
            exam: req.params.id,
        });
        await newOrder.save();
        //return res.status(200).json(newOrder);
          return res.status(200).json(response.RefID);
        }
  } catch (err) {
      return next(new ProgrammingError(err.message, err.stack));
      
  }
 },
}

export default paymentController;