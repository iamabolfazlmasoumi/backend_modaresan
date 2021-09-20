import express from 'express';
// controllers
import roleController from '../../controllers/role';

// middlwares
import {createRoleValidation, getRoleValidation, updateRoleValidation} from "../validations/role";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post('/', createRoleValidation, checkAccessControl('admin__create_role'), roleController.createRole);
router.get('/', checkAccessControl('admin__get_role_list'), roleController.rolesList);
router.get('/:id', getRoleValidation, checkAccessControl('admin__get_role'), roleController.showRole);
router.put('/:id', updateRoleValidation, checkAccessControl('admin__edit_role'), roleController.editRole);


export default router;