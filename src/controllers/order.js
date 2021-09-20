//utils
import randomstring from "randomstring";

//error handling
import OperationalError, {NOT_FOUND_ERROR} from '../api/validations/operational-error';
import ProgrammingError from '../api/validations/programmer-error';
//models
import Order from "../models/order";
import User from "../models/user";
import ExamPublish from "../models/exam-publish";
//debug
const debug = require("debug")("app:dev");


const orderController = {
    checkExamOrder: async function ( req, res, next ) {
        try
        {
            let order = await Order.findOne( { isDeleted: false, exam: req.params.id, user: req.user.id, orderType: "exam" } );
            if ( order )
            {
                return res.status( 200 ).json( order );
            } else
            {
                return null;
            }
                
            
               
      } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
      }  
    },
    checkExamProcessOrder: async function ( req, res, next ) {
        try
        {
            let order = await Order.findOne( { isDeleted: false, exam: req.params.id, user: req.user.id, orderType: "examprocess" } );
            if ( order )
                return res.status( 200 ).json( order );
               
      } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
      }  
    },
    createOrder: async function (req, res, next) {
        try {
            const {
                orderType
            } = req.body;
            let user = await User.findOne({ _id: req.user.id, isDeleted: false })
            if (!user)
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));
            switch (orderType) {
                case "course": {
                    let newOrder = await new Order({
                        orderType: orderType,
                        code: randomstring.generate({
                            length: 10,
                            charset: "alphanumeric",
                        }),
                        user: req.user.id,
                        mobile: user.mobile,
                        createdAt: Date.now(),
                        isPaid: false,
                        paidAt: null,
                       course: req.params.id
                    });
                    await newOrder.save();
                    return res.status(200).json(newOrder);
                }
                    
                case "webinar": {
                    let newOrder = await new Order({
                        orderType: orderType,
                        code: randomstring.generate({
                            length: 10,
                            charset: "alphanumeric",
                        }),
                        user: req.user.id,
                        mobile: user.mobile,
                        createdAt: Date.now(),
                        isPaid: false,
                        paidAt: null,
                        webinar: req.params.id
                    });
                    await newOrder.save();
                    return res.status(200).json(newOrder);
                }
                    
                case "exam": {
                    let newOrder = await new Order({
                        orderType: orderType,
                        code: randomstring.generate({
                            length: 10,
                            charset: "alphanumeric",
                        }),
                        user: req.user.id,
                        mobile:user.mobile,
                        createdAt: Date.now(),
                        isPaid: false,
                        paidAt: null,
                        exam: req.params.id,
                    });
                    await newOrder.save();
                    return res.status(200).json(newOrder);
                }
                    
            }

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamOrder: async function (req, res, next) {
        try {

            let order = await Order.findOne({
                order: req.params.id,
                isDeleted: false,
                orderType: "exam"
            } ).populate( "user" ).populate( "exam" );
            return res.status( 200 ).json( order );
        //     if ( !order )
        //     {
        //        let user = await User.findOne( { _id: req.user.id, isDeleted: false } );
        //     if (!user)
        //         return next( new OperationalError( NOT_FOUND_ERROR, "user" ) );
        //     let examPublish = await ExamPublish.findOne( { exam: req.params.id, isDeleted: false } );
        //         let newOrder = await new Order({
        //                 orderType: "exam",
        //                 code: randomstring.generate({
        //                     length: 10,
        //                     charset: "alphanumeric",
        //                 }),
        //                 user: req.user.id,
        //                 mobile:user.mobile,
        //                 createdAt: Date.now(),
        //                 payablePrice: examPublish.price,
        //                 isPaid: false,
        //                 paidAt: null,
        //                 exam: exam,
        //             });
        //             await newOrder.save();
        //             return res.status(200).json(newOrder);
        //     } else
        //     {
        //         return next( new OperationalError( NOT_FOUND_ERROR, "order" ) );
        //    }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showExamProcessOrder: async function (req, res, next) {
        try {

            let order = await Order.findOne({
                _id: req.params.id,
                isDeleted: false,
                orderType: "examprocess"
            }).populate("user").populate("examProcess");
            if (!order)
                return next(new OperationalError(NOT_FOUND_ERROR, "order"));
            return res.status(200).json(order);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getOrderList: async function (req, res, next) {
        try {
            let orders = await Order.find({
                isDeleted: false
            }).populate("user").populate("course").populate("webinar").populate("exam");
            return res.status(200).json(orders);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getUserOrderList: async function (req, res, next) {
        try {
            let user = await User.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!user)
                return next(new OperationalError(NOT_FOUND_ERROR, "user"));

            let orders = await Order.find({
                user: req.user.id,
                isDeleted: false
            });
            return res.status(200).json(orders);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    implementExamToUser: async function ( req, res, next ) {
        try
        {
            const {exam, callbackCode} = req.body
            let order = await Order.findOne( { _id: req.params.id, isDeleted: false, exam:exam, user:req.user.id } );
            if ( !order )
                return next( new OperationalError( NOT_FOUND_ERROR, "order" ) );
            //TODO check if callbackCode is ok and is sent from payment gateway?
            // if ( callbackCode.isOk )
            // {
            //     //
            // }
            let completedOrder = await Order.updateOne( { _id: req.params.id, isDeleted: false,  exam:exam, user:req.user.id }, {
                isPaid: true,
                paidAt: Date.now(),
                orderType: "exam",
                code: randomstring.generate({
                    length: 10,
                    charset: "alphanumeric",
                } ),
                callbackCode: callbackCode,
            } )
            return res.status( 200 ).json( completedOrder );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
            
        }
    }

}

export default orderController;