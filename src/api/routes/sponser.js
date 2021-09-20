import express from 'express';
// controller
import sponserController from '../../controllers/sponser';

// middlwares
import {createSponserValidation, getSponserValidation, updateSponserValidation} from "../validations/sponser";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post('/', createSponserValidation, checkAccessControl('teacher__create_sponser'), sponserController.createSponser);
router.get('/', sponserController.sponsersList);
router.get('/:id', getSponserValidation ,sponserController.showSponser);

// admin controles over sponsers
router.put('/handle/:id', updateSponserValidation, checkAccessControl('admin__handle_acceptrance_request'), sponserController.handleAcceptanceRequest);
router.put('/:id', sponserController.editSponser);
export default router;