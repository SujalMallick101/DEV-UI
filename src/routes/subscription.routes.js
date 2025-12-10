import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription
} from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { Router } from "express";

const router = Router();


router.route('/toggle/:channelId').post(verifyJWT, toggleSubscription);

router.route('/channel/:channelId').get(verifyJWT, getUserChannelSubscribers);

router.route('/subscriber/:subscriberId').get(verifyJWT, getSubscribedChannels);

export default router;