//router
import express from "express";
//controllers
import orderController from "../../controllers/order";

const router = express.Router();

//validations

//routes
router.get('/:id/exam-check', orderController.checkExamOrder);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.showExamOrder);
router.get('/:id/exam-process', orderController.showExamProcessOrder);
router.get('/', orderController.getOrderList);
router.get('/user/:id', orderController.getUserOrderList);
router.put('/:id/implement-user-exam', orderController.implementExamToUser)
router.get( "/:id", orderController.showExamOrder );
export default router;