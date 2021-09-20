import express from "express";
// controllers
import userController from "../../controllers/user";
import examController from "../../controllers/exam";
import scheduleController from "../../controllers/schedule";
import HRController from "../../controllers/human-resource";
import ticketController from "../../controllers/ticket";
// middlewares
import {
    changePasswordValidator,
    editMobileVerifyValidator,
    editMobileRequestValidator,
    editUserValidator,
    showUserValidator,
} from "../validations/user";
import { assignHRValidator, unAssignHRValidator } from "../validations/human-resource";
import { cache } from "../middlewares/cache";
import { checkAccessControl } from "../middlewares/access-control";



const router = express.Router();

//user routes

router.get("/", checkAccessControl('admin__get_user_list'), userController.usersList);
router.get("/info", userController.getUserInformation);

router.get("/:id", cache, userController.showUser);

router.put("/:id",
    // editUserValidator, 
    userController.editUser);

router.put(
    "/:id/edit-mobile/request",
    // editMobileRequestValidator,

    userController.editMobileRequest
);
router.put(
    "/:id/edit-mobile/verify",
    // editMobileVerifyValidator,

    userController.editMobileVerify
);

router.put(
    "/:id/change-password",
    // changePasswordValidator,
    userController.changePassword
);

router.put("/:id/assign-role", checkAccessControl('admin__assign_role_to_user'), userController.assignRoleToUser);

router.get("/:id/user-exams", checkAccessControl('admin__get_user_exams'), examController.showUserExamsForAdmin);

router.get("/schedule", scheduleController.userScheduleList);
router.put("/:id/hr/assign", assignHRValidator, HRController.assignHR);
router.put("/:id/hr/unassign", unAssignHRValidator, HRController.unassignHR);
router.get( "/ticket-list", ticketController.userTicketList );

router.put( "/account-security", userController.editAccountSecurity );
export default router;
