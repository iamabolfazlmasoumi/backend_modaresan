import uploadFile from "../api/middlewares/upload"
import uploadPdf from "../api/middlewares/uploadPdf"
import fs from "fs"
import xlsx from 'node-xlsx';
import randomstring from "randomstring";
import OperationalError, {
    NOT_FOUND_ERROR
} from '../api/validations/operational-error';
import ProgrammingError from '../api/validations/programmer-error';
import User from '../models/user';
import Order from '../models/order';
import Booklet from '../models/booklet';
import Exam from '../models/exam';

const uploadController = {
    uploadExamImageFile: async function ( req, res, next ) {
        try {
            await uploadFile( req, res );
            if ( req.file == undefined )
                return next( new OperationalError( NOT_FOUND_ERROR, 'uploadFile' ) );
            let exam = await Exam.findOne( { _id: req.params.id, isDeleted: false } );
            //console.log("booklet", booklet)
            if ( !exam )
                return next( new OperationalError( NOT_FOUND_ERROR, 'exam' ) );
            let updatedExam = await Exam.updateOne( { _id: req.params.id, isDeleted: false}, {
                imageName: req.file.filename,
            } )
            return res.status( 200 ).json( updatedExam);
        } catch ( err )
        {
            if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                fileName: req.file.filename
            });
    }
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    uploadBookletPdf: async function ( req, res, next ) {
        try {
            await uploadPdf( req, res );
            //console.log( 'req.file.filename', req.file.filename);

            if ( req.file == undefined )
                return next( new OperationalError( NOT_FOUND_ERROR, 'uploadFile' ) );
            let booklet = await Booklet.findOne( { _id: req.params.id, isDeleted: false } );
            console.log("booklet", booklet)
            if ( !booklet )
                return next( new OperationalError( NOT_FOUND_ERROR, 'booklet' ) );
            let updatedBooklet = await Booklet.updateOne( { _id: req.params.id, isDeleted: false}, {
                pdfUrl: `resources/static/assets/uploads/exam/booklet/${ req.file.filename }`,
            } )
            return res.status( 200 ).json( updatedBooklet);
        } catch ( err )
        {
            if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                fileName: req.file.filename
            });
    }
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getExamPdfFiles: async function ( req, res, next ) {
        try {
            const directoryPath = __basedir + "/resources/static/assets/uploads/exam/booklet";
            fs.readdir( directoryPath, function ( ree, files ) {
                if ( err )
                {
                    res.status(500).send({
                        message: "خطا در شناسایی فایل",
                    });
                };
                let fileInfos = [];
                for ( let file of files )
                {
                    fileInfos.push( {
                        name: file,
                        url: baseUrl + file,
                    } );
                }
                res.status( 200 ).json( fileInfos );
            })
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    downloadExamPdf: async function ( req, res, next){
        try
        {
            let booklet = await Booklet.findOne( { _id: req.params.id, isDeleted: false } )
            if ( !booklet )
                return next( new OperationalError( NOT_FOUND_ERROR, 'booklet' ) );
            const fileName = booklet.pdfUrl;
            const directoryPath = __basedir + "resources/static/assets/uploads/exam/booklet";
            res.downloadExamPdf( directoryPath + fileName, fileName, ( err ) => {
                if ( err )
                {
                    res.status(500).send({
                        message: "خطا در دانلود فایل " + err,
                    });
                }
            })
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    implementUserDataForExamination: async function (req, res, next) {
        try {
            const { fileName, examId } = req.body;
            const directoryPath = __basedir + "/resources/static/assets/uploads/exam";
            const useDataXlsxFile = xlsx.parse(`${directoryPath}/${fileName}.xlsx`);
            //return res.send(useDataXlsxFile[0].data)
            if (!useDataXlsxFile)
                return next(new OperationalError(NOT_FOUND_ERROR, fileName));
            if (useDataXlsxFile[0].data.length == 1)
                   return next( new OperationalError( NOT_FOUND_ERROR, 'myFileData' ) );
            //return res.status(200).json(useDataXlsxFile[0].data.length)
           for (let index = 1; index < useDataXlsxFile[0].data.length; index++) {
                const element = useDataXlsxFile[0].data[index];
                let userExist = await User.findOne({ mobile: element[2] });
               if (!userExist) {
                    //useDataXlsxFile[0].data.splice(index, 1); 
                    let newUser = new User({
                        firstName: element[0],
                        lastName: element[1],
                        mobile: element[2],
                        nationalCode: element[3],
                        password: element[4],
                        isActivated: true,
                        activationCode: randomstring.generate({
                            length: 6,
                            charset: "numeric",
                        }),
                        role: null,
                    });
                        await newUser.save();
                        console.log(newUser)
                        let order = await Order.findOne({ isPaid: true, isDeleted: false, exams: examId, mobile: newUser.mobile });
                    if (!order) {
                        let newOrder = new Order({
                                orderType: "exam",
                                code: randomstring.generate({
                                    length: 10,
                                    charset: "alphanumeric",
                                }),
                            user: newUser._id,
                                mobile: newUser.mobile,
                                createdAt: Date.now(),
                                isPaid: true,
                                paidAt: null,
                                exam: examId,
                            });
                        await newOrder.save();
                        console.log(newOrder)
                        }
               } else {
                   let order = await Order.findOne({ isPaid: true, isDeleted: false, exam: examId, mobile: userExist.mobile });
                    if (!order) {
                            let newOrder = new Order({
                                    orderType: "exam",
                                    code: randomstring.generate({
                                        length: 10,
                                        charset: "alphanumeric",
                                    }),
                                    user: userExist._id,
                                    mobile: userExist.mobile,
                                    createdAt: Date.now(),
                                    isPaid: true,
                                    paidAt: null,
                                    exam: examId,
                                });
                            await newOrder.save();
                            console.log(newOrder)
                        }
               }
               
           }
            let users = await User.find({ isDeleted: false, isActivated: true });
            return res.status(200).json(users);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
     uploadUserData: async function ( req, res, next ) {
        try {
            await uploadFile(req, res);
    
            if ( req.file == undefined )
                return next( new OperationalError( NOT_FOUND_ERROR, 'file' ) );
            return res.status( 200 ).send( { message: "آپلود فایل موفقیت آمیز بود: " + req.file.originalname})
        } catch ( err )
        {
            if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                fileName: req.file.originalname
            });
    }
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    renderBookletPdf: async function ( req, res, next ) {
         try
    {
             let booklet = await Booklet.findOne( { _id: req.params.id, isDeleted: false } );
             if ( !booklet )
                return next( new OperationalError( NOT_FOUND_ERROR, 'booklet' ) );
            let path = `./${booklet.pdfUrl}`
            var data =fs.readFileSync(path);
            res.contentType("application/pdf");
            res.send(data);
        } catch (err) {
            res.status(500)
            console.log(err)
            res.send(err.message)
        }
    },
    renderExamImage: async function ( req, res, next ) {
         try{
         
             let exam = await Exam.findOne( { _id: req.params.id, isDeleted: false } );
             if ( !exam )
                return next( new OperationalError( NOT_FOUND_ERROR, 'exam' ) );
            let path = `./resources/static/assets/uploads/files/${exam.imageName}`
            var data =fs.readFileSync(path);
            res.contentType("image/jpeg");
            res.send(data);
        } catch (err) {
            res.status(500)
            console.log(err)
            res.send(err.message)
        }
    }
}

export default uploadController;