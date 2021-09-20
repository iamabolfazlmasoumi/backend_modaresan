import util from "util";
import multer from "multer";
const maxSize = 10 * 1024 * 1024;
import Booklet from '../../models/booklet'
let storage = multer.diskStorage({
  destination: ( req, file, cb ) => {
    cb(null, __basedir + `/resources/static/assets/uploads/exam/booklet`);
  },
  filename: (req, file, cb) => {
    //console.log(file.originalname + Date.now());
    cb(null, req.params.id + "__" + file.originalname );
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");
let uploadFileMiddleware = util.promisify( uploadFile );

export default uploadFileMiddleware;
