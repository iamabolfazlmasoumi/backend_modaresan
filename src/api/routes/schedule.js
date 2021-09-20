import express from "express";
//controllers
import scheduleController from "../../controllers/schedule";

//middleware
import {checkAccessControl} from "../middlewares/access-control";

const router = express.Router();

//routes
router.get("/", scheduleController.userScheduleList);
router.get("/user/:id", checkAccessControl('admin:get_user_schedule_list'),scheduleController.userScheduleListForAdmin);

export default router;
