import { Playlist } from "../models/playlist.models.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    //get detail(name,description)
    //validate name
    //create 
    //return res

    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    if (!description) {
        throw new ApiError(400, "Playlist description is required");
    }

    const existingPlaylist = await Playlist.findOne({
        name,
        owner: req.user._id
    })

    if (existingPlaylist) {
        throw new ApiError(409, "Playlist with this name already exists");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, playlist, "Playlist created successfully")
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //get user id
    //validate
    //match user
    //fetch playlist
    //return res

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "User Id is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const playlists = await Playlist.find({ owner: userId })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "Playlists fetched successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //get playlist Id
    //validate
    //find playlist and populate data
    //validate playlist
    //return res

    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is required");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("owner", "userName avatar")
        .populate("videos", "title thumbnail duration")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist fetched successsfully by ID")
        )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    //get playlistId,videoId
    //validate
    //check ownership
    //match video and playlist
    //check video duplicacy
    //add video
    //return res

    const { playlistId, videoId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is required");
    }

    if (!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(409, "Video already exist in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video added successfully to this playlist")
        )



})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    //get playlist and video ids
    //validate
    //playlist match
    //ownership checking
    //video existence
    //remove video 
    //return res

    const { playlistId, videoId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is required");
    }

    if (!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(404, "Video not found in this playlist");
    }

    playlist.videos.pull(videoId);
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video removed successfully form this playlist")
        )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    //get playlist Id
    //validate
    //match playlist
    //ownership checking
    //delete 
    //return res

    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this playlist");
    }

    await playlist.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully")
        )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    //get playlist Id
    //get name,description
    //validate
    //ownership checking 
    //match playlist
    //update
    //return res

    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is required");
    }

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    if (!description) {
        throw new ApiError(400, "Playlist description is required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    playlist.name = name;
    playlist.description = description;
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist updated successfully")
        )
})


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}