import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishVideo,
    togglePublishStatus,
    updateVideo
} from "../controllers/video.controllers.js";


const router = Router();

router.route('/').get(verifyJWT, getAllVideos);

router.route('/publish').post(
    verifyJWT,
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishVideo
);

router.route('/:videoId').get(verifyJWT, getVideoById);

router.route('/:videoId').patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideo
);

router.route('/:videoId').delete(verifyJWT, deleteVideo);

router.route('/:videoId/toggle-publish').patch(verifyJWT, togglePublishStatus);



export default router;