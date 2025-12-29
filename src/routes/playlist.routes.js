import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controllers.js";

const router = Router();


router.route("/")
    .post(verifyJWT, createPlaylist)
    .get(verifyJWT, getUserPlaylists);


router.route("/:playlistId")
    .get(getPlaylistById)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);


router.route("/:playlistId/video/:videoId")
    .post(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist);

export default router;
