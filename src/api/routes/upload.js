import express from 'express';
// controllers
import uploadController from '../../controllers/upload';


const router = express.Router();

// routes
router.post( "/exam/:id", uploadController.uploadExamImageFile);
router.post("/booklet/:id", uploadController.uploadBookletPdf);
router.get("/files", uploadController.getExamPdfFiles);
router.get("/files/:name", uploadController.downloadExamPdf);
router.get("/implement-user-examination", uploadController.implementUserDataForExamination);
router.post( "/upload-user-data", uploadController.uploadUserData );
router.get("/booklet/:id/download", uploadController.downloadExamPdf)
export default router;