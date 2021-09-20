import express from "express";
// controllers
import departmentController from "../../controllers/department";
import HRController from "../../controllers/human-resource";
import ticketController from "../../controllers/ticket";
import {
    createDepartmentValidator,
    getDepartmentUsersValidator,
} from "../validations/department";
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

// routes
router.post("/", createDepartmentValidator, checkAccessControl('admin__create_department'), departmentController.createDepartment);
router.get("/", departmentController.getDepartments);
router.get("/hr-list", checkAccessControl('admin__get_hr_list'),HRController.HRList);
router.get("/:id/users", getDepartmentUsersValidator, checkAccessControl('admin__get_users_of_department'),departmentController.getUsersOfDepartment);
router.get("/:id/tickets", checkAccessControl('admin__get_department_tickets'), ticketController.getDepartmentTickets);
export default router;
