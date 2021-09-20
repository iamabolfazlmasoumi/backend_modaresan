import express from 'express';
import permissionController from '../../controllers/permission';
import {
    createPermissionValidation,
    getPermissionValidation,
    updatePermissionValidation
} from "../validations/permissions";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();


router.post('/', createPermissionValidation, checkAccessControl('admin__create_permission'), permissionController.createPermission);
router.get('/', checkAccessControl('admin__get_permission_list'), permissionController.permissionsList);
router.get('/:id', getPermissionValidation, checkAccessControl('admin__get_permission'), permissionController.showPermission);
router.put('/:id', updatePermissionValidation, checkAccessControl('admin__edit_permission'), permissionController.editPermission);


export default router;