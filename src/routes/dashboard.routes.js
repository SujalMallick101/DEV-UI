import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getChannelStats } from "../controllers/dashboard.controllers";


const router = Router();

router.route('/stats').get(verifyJWT, getChannelStats);
router.route('/videos').get(verifyJWT, getChannelVideos);


export default router;