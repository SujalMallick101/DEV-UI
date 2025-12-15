import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
} from "../controllers/like.controllers.js";


const router = Router()


router.route('/video/:videoId').post(
    verifyJWT,
    toggleVideoLike
);

router.route('/comment/:commentId').post(
    verifyJWT,
    toggleCommentLike
);

router.route('/tweet/:tweetId').post(
    verifyJWT,
    toggleTweetLike
);

router.route('/videos').get(
    verifyJWT,
    getLikedVideos
);

export default router;