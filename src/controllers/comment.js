import Comment from '../models/comment';
import ProgrammingError from "../api/validations/programmer-error";
import OperationalError, { ALREADY_EXISTS_ERROR, NOT_FOUND_ERROR, } from "../api/validations/operational-error";

const debug = require( 'debug' )( 'app:dev' );

const commentController = {
    createExamComment: async function ( req, res, next ) {
        try
        {
            const { body } = req.body;
            let newComment = new Comment( {
                body: body,
                status: "isSent",
                user: req.user.id,
                exam: req.params.id, 
                type: "exam"
                
        } );
        await newComment.save();
        return res.status( 200 ).json( newComment );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    
    getExamCommentList: async function ( req, res, next ) {
        try {
            let comments = await Comment.find( {isDeleted: false, status: 'accepted', type: 'exam', exam:req.params.id} ).populate("user", 'firstName lastName avatar');
            console.log("comments", comments)
            return res.status( 200 ).json( comments );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

    getCommentForAdmin: async function ( req, res, next ) {
        try {
            let comment = await Comment.findOne( { isDeleted: false, _id: req.params.id } ).populate("user");
            if ( !comment )
                return next( new OperationalError( NOT_FOUND_ERROR, "comment" ) );
            return res.status( 200 ).json( comment );
        } catch ( err )
        {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    acceptComment: async function ( req, res, next ) {
        try {
            let comment = await Comment.findOne( { isDeleted: false, _id: req.params.id } )
            if ( !comment )
                return next( new OperationalError( NOT_FOUND_ERROR, "comment" ) );
            let acceptComment = await Comment.updateOne( { isDeleted: false, _id: req.params.id }, {
                status: "accepted",
                updatedAt: Date.now()
            } );
            return res.status( 200 ).json( acceptComment );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    rejectComment: async function ( req, res, next ) {
        try {
            let comment = await Comment.findOne( { isDeleted: false, _id: req.params.id } )
            if ( !comment )
                return next( new OperationalError( NOT_FOUND_ERROR, "comment" ) );
            let rejectComment = await Comment.updateOne( { isDeleted: false, _id: req.params.id }, {
                status: "rejected",
                updatedAt: Date.now()
            } );
            return res.status( 200 ).json( rejectComment );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteComment: async function ( req, res, next ) {
        try {
            let comment = await Comment.findOne( { isDeleted: false, _id: req.params.id } )
            if ( !comment )
                return next( new OperationalError( NOT_FOUND_ERROR, "comment" ) );
            let deleteComment = await Comment.updateOne( { isDeleted: false, _id: req.params.id }, {
                isDeleted:true,
                updatedAt: Date.now()
            } );
            return res.status( 200 ).json( deleteComment );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getAllCommentsWithExamType: async function ( req, res, next ) {
         try {
             let comments = await Comment.find( { isDelete: false, status: "accepted", type: "exam" } ).populate( "user" ).populate("exam");
            return res.status( 200 ).json( comments );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getUserExamCommentList: async function ( req, res, next ) {
        try {
            let comments = await Comment.find( { isDelete: false, status: "accepted", type: "exam" } ).populate( "user" ).populate("exam");
            return res.status( 200 ).json( comments );
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

}

export default commentController;