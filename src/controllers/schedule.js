import OperationalError, {
    ALREADY_EXISTS_ERROR,
    INVALID_OPERATION_ERROR,
    NOT_AUTHORIZED_ERROR,
} from "../api/validations/operational-error";
import ProgrammingError from "../api/validations/programmer-error";
import Schedule from "../models/schedule";

const scheduleController = {
    defineSchedule: async function (req, res, next) {
        try {
            const {
                date,
                startTime,
                endTime,
                user
            } = req.body;
            let schedule = await Schedule.findOne({
                user: req.user.id,
                date: date,
                isDeleted: false,
                user: user
            })
            if (schedule.startTime < startTime && schedule.endTime > endTime) {
                return next(new OperationalError(NOT_AUTHORIZED_ERROR, "schedule"));
            }
            let newSchedule = await new Schedule({
                date: date,
                startTime: startTime,
                endTime: endTime,
                user: user,
            });
            await newSchedule.save();
            return res.status(200).json(newSchedule);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    userScheduleList: async function (req, res, next) {
        try {
            let schedule = await Schedule.find({
                user: req.user.id,
                isDeleted: false
            });
            return res.status(200).json(schedule);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    userScheduleListForAdmin: async function (req, res, next) {
        try {
            let schedule = await Schedule.find({
                user: req.params.id,
                isDeleted: false
            });
            return res.status(200).json(schedule);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    }
}

export default scheduleController;