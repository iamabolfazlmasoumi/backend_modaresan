import express from 'express';
// controllers
import siteSettingController from '../../controllers/site-setting';

// middlewares
import {createSiteSettingValidation} from "../validations/site-setting";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// Setting Routes
router.post('/', checkAccessControl('admin__handle_setting'), siteSettingController.handleGeneralSetting);
router.get('/', checkAccessControl('admin__get_setting'), siteSettingController.showGeneralSetting);
router.put( '/exam-category', siteSettingController.createExamCategoryForIndex )
router.get( '/exam-category', siteSettingController.getExamCategoryForIndex );

export default router;