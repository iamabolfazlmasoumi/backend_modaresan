const path = require("path");
const fs = require("fs");

// validations
import OperationalError, {
    ALREADY_EXISTS_ERROR,
    NOT_AUTHORIZED_ERROR,
    NOT_FOUND_ERROR
} from '../api/validations/operational-error';
import ProgrammingError from '../api/validations/programmer-error';
// models
import Exam from '../models/exam';
import Booklet from '../models/booklet';
import ExamBasic from '../models/exam-basic';
import BookletMaterial from '../models/booklet-material';
import MaterialQuestion from '../models/material-questions';
import ExamPublish from '../models/exam-publish';
import Lesson from '../models/lesson';
import Option from '../models/option';
import AnswerSheet from '../models/answer-sheet';
import PdfAnswer from '../models/pdf-answer';
import Question from '../models/question';

import {checkIfExistNextBooklet} from '../api/utils';
import examBasic from '../models/exam-basic';
import pdfAnswer from '../models/pdf-answer';

const debug = require('debug')('app:dev');

const ExaminationController = {
    showExaminationInfo: async function (req, res, next) {
        try {

            let result = Object.create({});
            let exam = await Exam.findOne({_id: req.params.id, isDeleted: false});

            // order must be checked to let user exam start
            // start time must checked to start exam 
            let examBasic = await ExamBasic.findOne({exam: req.params.id, isDeleted: false});
            let examPublish= await ExamPublish.findOne({exam: req.params.id, isDeleted: false});

            if (exam && examBasic) {
                let booklets = await Booklet.find({exam: req.params.id, isDeleted: false});
                let bookletMaterials = await BookletMaterial.find({exam: req.params.id, isDeleted: false});
                debug("bookletMaterials", bookletMaterials);
                let questionsCount = await bookletMaterials.reduce((prev, item) => {
                    return prev + item.questionsCount;
                }, 0);
                let totalTime = await bookletMaterials.reduce((prev, item) => {
                    return prev + item.time;
                }, 0);
                let bookletArr = [];
                for (let booklet of booklets) {
                    let materials = await BookletMaterial.find({
                        booklet: booklet._id,
                        isDeleted: false
                    }).populate("lesson").populate("seasons").populate("topics");
                    debug("materials", materials);
                    let bookletQuestionsCount = 0;
                    let bookletTotalTime = 0;

                    for (let material of materials) {
                        bookletQuestionsCount += material.questionsCount;
                        bookletTotalTime += material.time;
                    }
                    // please check the performance of this 2 for loop by replacing other method such as reduce
                    // which it seems has lower performance compared with for loop! btw its better to check the performance! :)
                    let bookletObj = Object.create({});
                    bookletObj._id = booklet._id;
                    bookletObj.title = booklet.title;
                    bookletObj.bookletMaterials = materials;
                    bookletObj.bookletQuestionsCount = bookletQuestionsCount;
                    bookletObj.bookletTotalTime = bookletTotalTime;
                    bookletArr.push(bookletObj);
                }

                result.title = exam.title;
                result.isPdfVersion = exam.isPdfVersion,
                result.bookletNumber = exam.bookletNumber;
                result.questionsCount = questionsCount;
                result.totalTime = totalTime;
                result.startTime = examPublish.startTime,
                result.examCode = exam.code;
                result.booklets = bookletArr;
                result.withNegativePoint = examBasic.withNegativePoint;
                debug(result)
                return res.status(200).json(result);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'examOrExamBasic'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    createAnswerSheet: async function (req, res, next) {
        try {
            let bookletQuestionsCount = 0;
            let materials = await BookletMaterial.find({booklet: req.params.id, isDeleted: false});
            debug(materials)
            for (let material of materials) {
                bookletQuestionsCount += material.questionsCount;
            }
            debug(bookletQuestionsCount);
            let answerSheet = await AnswerSheet.findOne({booklet: req.params.id, isDeleted: false, user: req.user.id });
            if (!answerSheet) {
                let newAnswerSheet = new AnswerSheet({
                    booklet: req.params.id,
                    user: req.user.id
                });
                debug(newAnswerSheet);
                await newAnswerSheet.save();
                return res.status(200).json(newAnswerSheet);
            } else {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'answerSheet'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    updateAnswerSheet: async function (req, res, next) {
        try {
            //Todo check examination expire time ! => examination type and examination expire time for more security
            const {question, option} = req.body;
            let answerSheet = await AnswerSheet.findOne({booklet: req.params.id, isDeleted: false, user: req.user.id});
            let answersArr = answerSheet.answers;
            debug("answersArr", answersArr);

            const found = await answersArr.find(a => a.questionId === question);
            debug(found);
            if (found) {

                found.selectedOptionId = option;
                let updatedAnswerSheet = await AnswerSheet.updateOne({booklet: req.params.id, isDeleted: false, user:req.user.id}, {
                    answers: answersArr,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(updatedAnswerSheet);
            } else {
                let targetAnswer = Object.create({});

                targetAnswer.questionId = question;
                targetAnswer.selectedOptionId = option;
                debug("targetAnswer", targetAnswer);

                await answersArr.push(targetAnswer);
                debug("newAnswerArr", answersArr);

                let updatedAnswerSheet = await AnswerSheet.updateOne({booklet: req.params.id, isDeleted: false, user: req.user.id}, {
                    answers: answersArr,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(updatedAnswerSheet);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    completeExaminationStep: async function (req, res, next) {
        try {
            let answerSheet = await AnswerSheet.findOne({booklet: req.params.id, isDeleted: false, user:req.user.id});
            debug("answerSheet", answerSheet)
            if (answerSheet.isCompleted) {
                return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'examinationStepIsCompleted'));
            } else {
                let completed = await AnswerSheet.updateOne({booklet: req.params.id, isDeleted: false, user:req.user.id}, {
                    isCompleted: true,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(completed);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    completeExaminationPdfStep: async function (req, res, next) {
        try {
            let answerSheet = await PdfAnswer.findOne({booklet: req.params.id, isDeleted: false, user:req.user.id});
            debug("answerSheet", answerSheet)
            if (answerSheet.isCompleted) {
                return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'examinationStepIsCompleted'));
            } else {
                let completed = await PdfAnswer.updateOne({booklet: req.params.id, isDeleted: false, user:req.user.id}, {
                    isCompleted: true,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(completed);
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getAnswerSheet: async function (req, res, next) {
        try {
            let answerSheet = await AnswerSheet.findOne({ booklet: req.params.id, isDeleted: false, user:req.user.id })
            return res.status(200).json(answerSheet)

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    checkNextBooklet: async function (req, res, next){
        try {
            return checkIfExistNextBooklet();
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    showBookletData: async function (req, res, next) {
         try {
            if (checkIfExistNextBooklet) {
                let booklet = await Booklet.findOne({_id: req.params.id, isDeleted: false});
                debug("booklet", booklet)
                let examId = await booklet.exam;
                let exam = await Exam.findOne({_id: examId, isDeleted:false});
                debug("examId", examId)

                //Todo check user has access (payment) to this exam?
                let bookletQuestionsCount = 0;
                let bookletTotalTime = 0;
                let materials = await BookletMaterial.find({exam: examId, booklet: req.params.id, isDeleted: false});
                let materialArr = [];
                for (let material of materials) {
                    bookletQuestionsCount += material.questionsCount;
                    bookletTotalTime += material.time;
                    if(exam.isPdfVersion == false) {
                        let materialQuestions = await MaterialQuestion.find({
                            bookletMaterial: material.id,
                            isDeleted: false
                        })
                        debug("mq", materialQuestions)
                        for (let materialQuestion of materialQuestions) {
                            let questionIds = await materialQuestion.questions;
                            debug("questionIds", questionIds)
                            let questionArr = [];
                            for (let questionId of questionIds) {
                                let question = await Question.findOne({_id: questionId, isDeleted: false});
                                let options = await Option.find({question: question._id, isDeleted: false});
                                debug("options", options)
                                let questionObj = Object.create({});
                                questionObj.question = question;
                                questionObj.options = options;
                                questionArr.push(questionObj);
                            }
                            let lesson = await Lesson.findOne({_id: material.lesson, isDeleted: false});
                            let materialObj = Object.create({});
                            materialObj._id = material._id;
                            materialObj.title = lesson.title;
                            materialObj.questions = questionArr;
                            materialObj.materialQuestionsCount = material.questionsCount;
                            materialObj.materialTotalTime = material.time;
                            materialObj.materialFactor = material.factor;
                            materialArr.push(materialObj);
                        }
                    }
                    else{
                        let lesson = await Lesson.findOne({_id: material.lesson, isDeleted: false});
                        let materialObj = Object.create({});
                        materialObj._id = material._id;
                        materialObj.title = lesson.title;
                        materialObj.materialPdfFile = material.materialPdfFile;
                        materialObj.materialTotalTime = material.time;
                        materialObj.materialFactor = material.factor;
                        materialObj.materialQuestionsCount = material.questionsCount;
                        materialArr.push(materialObj);
                    }
                    

                }
                let examPublish = await ExamPublish.findOne({exam: examId, isDeleted: false});
                debug("examPublish", examPublish)
                let bookletObj = Object.create({});
                bookletObj._id = booklet.id;
                bookletObj.title = booklet.title;
                bookletObj.totalTime = bookletTotalTime;
                bookletObj.questionsCount = bookletQuestionsCount;
                bookletObj.startTime = examPublish.startTime;
                bookletObj.material = materialArr;

                let examinationObj = await Object.create({});
                examinationObj.examId = exam._id;
                examinationObj.examTitle = exam.title;
                examinationObj.booklet = bookletObj;
                return res.status(200).json(examinationObj);
            } else {
                return next(new OperationalError(NOT_FOUND_ERROR, 'booklet'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    endExamination: async function (req, res, next) {
       try {
            let booklet = await findOne( { _id: req.params.id, isDeleted: false } );
            if ( !booklet )
                return next( new OperationalError( NOT_FOUND_ERROR, 'booklet' ) );
           let exam = booklet.exam;
           let completedExam = await Exam.updateOne( { _id: exam, isDeleted: false }, {
               isCompleted:true
           } );
           return res.status(200).json(completedExam)
       } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
       }
    },
    createPdfAnswer: async function ( req, res, next ) {
        try
        {
            let bookletQuestionsCount = 0;
            let materials = await BookletMaterial.find({booklet: req.params.id, isDeleted: false});
            debug(materials)
            for (let material of materials) {
                bookletQuestionsCount += material.questionsCount;
            }
             debug( bookletQuestionsCount );
             let answerArr = [];
             for (let index = 0; index < bookletQuestionsCount; index++) {
                 const element = {"q": index+1, "a": null}
                 answerArr.push(element)
             }
            let booklet = await Booklet.findOne({_id:req.params.id, isDeleted:false})
            if ( !booklet )
                return next( new OperationalError( NOT_FOUND_ERROR, 'booklet' ) );
            let pdfAnswer = await PdfAnswer.findOne({booklet: req.params.id, isDeleted: false, user:req.user.id});
            if (!pdfAnswer) {
                if(booklet.user == req.user.id){
                    let newPdfAnswer = new PdfAnswer({
                        booklet: req.params.id,
                        bookletQuestionsCount: bookletQuestionsCount,
                        answers: answerArr,
                        user:req.user.id,
                        exam: booklet.exam,
                        isMain: true, 
                    });
                    debug(newPdfAnswer);
                    await newPdfAnswer.save();
                    return res.status(200).json(newPdfAnswer);
                }else{
                    let newPdfAnswer = new PdfAnswer({
                        booklet: req.params.id,
                        bookletQuestionsCount: bookletQuestionsCount,
                        answers: answerArr,
                        user:req.user.id,
                        exam: booklet.exam,
                        isMain: false, 
                    });
                    debug(newPdfAnswer);
                    await newPdfAnswer.save();
                    return res.status(200).json(newPdfAnswer);
                }
                
            } else {
                return next(new OperationalError(ALREADY_EXISTS_ERROR, 'answerSheet'));
            }
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getBookletQuestionsCount: async function ( req, res, next ) {
      try {
            let bookletQuestionsCount = 0;
            let bookletTotalTime = 0;
          let materials = await BookletMaterial.find( { booklet: req.params.id, isDeleted: false } );
          if ( materials.length == 0 )
                return next( new OperationalError( NOT_FOUND_ERROR, 'materials' ) );
              
            for ( let material of materials )
            {
                bookletQuestionsCount += material.questionsCount;
                bookletTotalTime += material.time;
            }
          return res.status( 200 ).json( { "bookletQuestionsCount": bookletQuestionsCount, "bookletTotalTime": bookletTotalTime } );
      } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
          
      }  
    },
    showPdfAnswer: async function ( req, res, next ) {
        try
        {
            let pdfAnswer = await PdfAnswer.findOne( { booklet: req.params.id, isDeleted: false, user:req.user.id } );
            if ( !pdfAnswer )
                return next( new OperationalError( NOT_FOUND_ERROR, 'pdfAnswer' ) );
            return res.status( 200 ).json( pdfAnswer );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    updatePdfAnswer: async function ( req, res, next ) {
        try {
            //Todo check examination expire time ! => examination type and examination expire time for more security
            const {question, option} = req.body;
            let pdfAnswer = await PdfAnswer.findOne({booklet: req.params.id, isDeleted: false, user:req.user.id});
            let answersArr = pdfAnswer.answers;
            debug("answersArr", answersArr);

            const found = await answersArr.find(a => a.q === question);
            debug(found);
            if (found) {
                found.a = option;
                let updatedPdfAnswer = await PdfAnswer.updateOne({booklet: req.params.id, isDeleted: false, user:req.user.id}, {
                    answers: answersArr,
                    updatedAt: Date.now(),
                });
                return res.status(200).json(updatedPdfAnswer);
            } 
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    // examinationPdfResults: async function (req, res, next){
    //     try {
    //         const {userId} = req.body;
    //         let booklets = await Booklet.find({exam:req.params.id, isDeleted:false});
    //         for(let booklet of booklets){
    //             let materials = await BookletMaterial.find({booklet: booklet._id});
    //             console.log("materials", materials)
    //             // let totalq = await materials.reduce((prev, item) => {
    //             //         return prev + item.questionsCount;
    //             //     }, 0);
                







    //                 let mainAnswers = await PdfAnswer.findOne({booklet:booklet._id, isMain: true})
    //                 console.log("mainAnswers", mainAnswers)
    //                 let materialResultArr = [];
    //                 for (let index = 0; index < materials.length; index++) {
    //                     let material = materials[index];
    //                     let materialQuestionsCount = material.questionsCount;
    //                     let userAnswer = await PdfAnswer.findOne({user:userId, booklet:booklet._id});
    //                     console.log("userAnswer", userAnswer)
    //                     let materialAnswers  = mainAnswers.answers
    //                     console.log("materialAnswers", materialAnswers);
    //                     console.log("mainAnswers.answers", mainAnswers.answers);
    //                     let userMaterialAnswer = userAnswer.answers
    //                     // let totalq = totalq - materialQuestionsCount;
    //                     // console.log("totalq", totalq)
    //                 // check the userMaterial Answer and push the result to an array with its title
    //                 // also u can save it a result in database to load it faster
    //                 let materialPureArr = [];
    //                 for(let i = 0; i < userMaterialAnswer.length; i++){
    //                     let answer = userMaterialAnswer[i].a 
                        
    //                     if(answer == materialAnswers[i].a){
    //                         let el = {"state": 1}
    //                         materialPureArr.push(el)
    //                     }
    //                     if(answer != materialAnswers[i].a &&  materialAnswers[i].a != null)
    //                     {
    //                         let el = {"state": -1}
    //                         materialPureArr.push(el)
    //                     }
    //                     if(answer != materialAnswers[i].a &&  materialAnswers[i].a == null)
    //                     {
    //                         let el = {"state": 0}
    //                         materialPureArr.push(el)
    //                     }
    //                 }
    //                 let examBasic = await ExamBasic.findOne({exam:req.params.id, isDeleted:false});
    //                 // console.log("examBasic", examBasic)
    //                 if(examBasic.withNegativePoint == true){
                        
    //                     let trueAns = materialPureArr.filter(r => r.state == 1);
    //                     let trueAnsCount = trueAns.length
                        
    //                     let falseAns = materialPureArr.filter(r => r.state == -1);
    //                     let falseAnsCount = falseAns.length;
                        
    //                     let percentage = 100*(trueAnsCount*3 - falseAnsCount)/((materialPureArr.length)*3)
    //                     console.log("percentage", percentage)
    //                     materialResultArr.push({"user": userId, "booklet": booklet , "material": material, "result": materialPureArr, "percentage": percentage});
    //                     return res.status(200).json(materialResultArr)
    //                 }
    //                 if(examBasic.withNegativePoint == false){
    //                     let trueAns = materialPureArr.filter(r => r.state == 1);
    //                     let trueAnsCount = trueAns.length

                      
    //                     let percentage = 100*(trueAnsCount)/(materialPureArr.length)
    //                     console.log("percentage", percentage)
    //                     materialResultArr.push({"user": userId, "booklet": booklet , "material": material, "result": materialPureArr, "percentage": percentage});
    //                     return res.status(200).json(materialResultArr)

    //                 }
                   
    //             }
    //         }
           
    //     } catch (err) {
    //         return next(new ProgrammingError(err.message, err.stack));
            
    //     }
    // },
}

export default ExaminationController;