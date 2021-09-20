import express from 'express';
import categoryController from '../../controllers/category';
import {
    createBranchValidation,
    createGroupValidation,
    createSubBranchValidation,
    createSubGroupValidation
} from "../validations/category";
import {checkAccessControl} from '../middlewares/access-control'

const router = express.Router();


// routes
router.post('/branch', createBranchValidation, checkAccessControl('admin__create_branch'), categoryController.createBranch);
router.post('/sub-branch', createSubBranchValidation, checkAccessControl('admin__create_sub_branch'), categoryController.createSubBranch);
router.post('/group', createGroupValidation, checkAccessControl('admin__create_group'), categoryController.createGroup);
router.post('/sub-group', createSubGroupValidation, checkAccessControl('admin__create_sub_group'), categoryController.createSubGroup);

router.get('/branch', categoryController.branchesList);
router.get('/sub-branch', categoryController.subBranchesList);
router.get('/group', categoryController.groupsList);
router.get('/sub-group', categoryController.subgroupsList);
router.get('/', categoryController.categoryList);

router.put('/branch/:id', categoryController.editBranch);
router.put('/sub-branch/:id', categoryController.editSubBranch);
router.put('/group/:id', categoryController.editGroup);
router.put('/sub-group/:id', categoryController.editSubGroup);

export default router