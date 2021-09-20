import express from 'express';
// controllers
import paymentController from '../../controllers/payment';


const router = express.Router();

// routes
router.post( "/request", paymentController.paymentRequest );
router.post( "/verify/:id", paymentController.paymentVerification);

router.post( "/request/exam", paymentController.examPaymentRequest );
router.post( "/verify/exam/:id", paymentController.examPaymentVerification);
export default router;