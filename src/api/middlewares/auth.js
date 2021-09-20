import jwt from 'jsonwebtoken';
import OperationalError, {NOT_AUTHENTICATED_ERROR} from "../validations/operational-error";

const secretKey = process.env.SECRET_KEY;

const authMiddleware = {
    authenticateToken(req, res, next) {
        try {


            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]

            if (token == null) return res.sendStatus(401)
            let verifiedUser = jwt.verify(token, secretKey);
            if (!verifiedUser) return res.status(401).send('Unauthorized request/ Not Verified')

            req.user = verifiedUser;

            next();
        } catch (e) {
            return next(new OperationalError(NOT_AUTHENTICATED_ERROR, 'request'))
        }
    }
}


export default authMiddleware;