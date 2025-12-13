import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { Tweet } from "../models/tweet.models.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
    //get video id
    //validate
    //check for video existing
    //validate the video
    //check for existed like 
    //if yes-then unlike it
    //otherwise liked it

    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        video: videoId
    })

    if (existingLike) {
        await existingLike.deleteOne();

        return res
            .status(200)
            .json(
                new ApiResponse(200, { liked: false }, "Video unliked")
            )
    }

    await Like.create({
        likedBy: req.user._id,
        video: videoId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { liked: true }, "Video liked")
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        comment: commentId
    })

    if (existingLike) {
        await existingLike.deleteOne()
        return res
            .status(200)
            .json(
                new ApiResponse(200, { liked: false }, "Comment unliked")
            )
    }

    await Like.create({
        likedBy: req.user._id,
        comment: commentId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { liked: true }, "Comment Liked")
        )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        tweet: tweetId
    })

    if (existingLike) {
        await existingLike.deleteOne()
        return res
            .status(200)
            .json(
                new ApiResponse(200, { liked: false }, "Tweet Unliked")
            )
    }

    await Like.create({
        likedBy: req.user._id,
        tweet: tweetId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { liked: true }, "Tweet Liked")
        )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //get user
    //validate
    //find liked videos
    //extract video ids
    //fetch videos
    //return res

    const  userId  = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Unauthorized");
    }

    const likes = await Like.find({
        likedBy: userId,
        video: { $exists: true }
    })

    const videoIds = likes.map(like => like.video)

    const videos = await Video.find({
        _id: { $in: videoIds }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { totalVideos: videos.length, videos },
                "Liked videos fetched successfully"
            )
        )
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}