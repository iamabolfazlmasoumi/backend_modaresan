import express from 'express';
// controllers
import authController from '../../controllers/auth';

// middlewares
import {registryValidation, signInValidation, signupVerificationValidation} from "../validations/auth";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

// routes
router.post('/signin', signInValidation, authController.signin);
router.post('/signup/request', registryValidation, authController.signup);
router.put('/signup/verify', signupVerificationValidation, authController.verifyUserSignUp); // Caution: user must be check if temporarily signed in or not.
router.post('/send-activation-code', authMiddleware.authenticateToken, authController.sendActivationCode);
router.put('/forgotPassword/verify-activation-code', authController.forgotPassword);

export default router;