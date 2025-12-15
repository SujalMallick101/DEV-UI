import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";

const addComment = asyncHandler(async (req, res) => {
    //get videoID,content
    //validate
    //match the video
    //create a comment 
    //return res

    const { videoId } = req.params;
    const { content } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                comment,
                "Comment added successfully"
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    //get commentId,content
    //validate
    //match comment
    //check for allowance of update
    //update the comment and save
    //return res

    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
        throw new ApiError(400, "Comment Id is required");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Update not allowed");
    }

    comment.content = content;
    await comment.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "Comment updated successsfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    //get commentId
    //validate
    //match comment
    //check for allowance of deletion
    //delete the comment
    //return res

    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment Id is required");
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Deletion not allowed");
    }

    await comment.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Comment deleted successfully")
        )
})

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comments = await Comment.find({ video: videoId })
        .populate("owner", "userName avatar")
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { totalComments: comments.length, comments },
                "Comments fetched successfully"
            )
        )

})


export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}