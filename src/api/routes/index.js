import {readdirSync} from "fs";
import {Router} from 'express';
import authMiddleware from "../middlewares/auth";
import userRouter from './user'
import authRouter from './auth'
import fiscalYearRouter from './fiscal-year'
import optionRouter from './option'
import regionRouter from './region'
import categoryRouter from './region'
import permissionRouter from './permission'
import subjectRouter from './subject'
import roleRouter from './role'
import sponserRouter from './sponser'
import materialRouter from './material'
import bookletRouter from './booklet'
import questionRouter from './question'
import examRouter from './exam'
import examBasicRouter from './exam-basic'
import departmentRouter from './department'
import examinationRouter from './examination'
import landingRouter from './landing'
import commentRouter from './comment'
import settingRouter from './site-setting'
import uploadRouter from './upload'
import salesSettingRouter from './sales-setting'
import orderRouter from './order'
import paymentRouter from './payment'
const router = Router()

router.use( '/site-setting', authMiddleware.authenticateToken,settingRouter );
router.use('/auth', authRouter)
router.use('/user', authMiddleware.authenticateToken, userRouter)
router.use('/fiscal-year', authMiddleware.authenticateToken, fiscalYearRouter)
router.use('/option', authMiddleware.authenticateToken, optionRouter)
router.use('/region', authMiddleware.authenticateToken, regionRouter)
router.use('/category', authMiddleware.authenticateToken, categoryRouter)
router.use('/permission', authMiddleware.authenticateToken, permissionRouter)
router.use('/subject', authMiddleware.authenticateToken, subjectRouter)
router.use('/role', authMiddleware.authenticateToken, roleRouter)
router.use('/sponser', authMiddleware.authenticateToken, sponserRouter)
router.use('/material', authMiddleware.authenticateToken, materialRouter)
router.use('/booklet', authMiddleware.authenticateToken, bookletRouter)
router.use('/question', authMiddleware.authenticateToken, questionRouter)
router.use('/exam', authMiddleware.authenticateToken, examRouter)
router.use('/exam-basic', authMiddleware.authenticateToken, examBasicRouter)
router.use('/department', authMiddleware.authenticateToken, departmentRouter)
router.use('/examination', authMiddleware.authenticateToken, examinationRouter)
router.use( '/landing', landingRouter );
router.use( '/comment', authMiddleware.authenticateToken, commentRouter );
router.use( '/upload', authMiddleware.authenticateToken, uploadRouter );
router.use( '/sale-setting', authMiddleware.authenticateToken, salesSettingRouter );
router.use( '/order', authMiddleware.authenticateToken, orderRouter );
router.use( '/payment', authMiddleware.authenticateToken, paymentRouter );
readdirSync('src/api/routes').map(async (route) => {
    const {default: handler} = await import(`./${route}`)
    router.use(`/${route.slice(0, -3)}`, handler)

});


export default router
