import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
} from "../controllers/comment.controllers.js";


const router = Router();

router.route('/video/:videoId').get(
    getVideoComments
)

router.route('/video/:videoId').post(
    verifyJWT,
    addComment
)

router.route('/:commentId').patch(
    verifyJWT,
    updateComment
)

router.route('/:commentId').delete(
    verifyJWT,
    deleteComment
)

export default router;