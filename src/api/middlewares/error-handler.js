import OperationalError from "../validations/operational-error";
import ProgrammingError from "../validations/programmer-error";

// Responsible for handling all errors.
export const errorHandler = (err, req, res, next) => {
    if (err instanceof OperationalError)
        return res.status(err.type.code).json({error: `${err.problem}${err.type.template}`}).end()
    else if (err instanceof ProgrammingError) {
        console.error(err.message)
        console.error(err.location)
        return res.status(err.code).json({error: `serverError`}).end()
    }
}