import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Build filter object
    let filter = { isPublished: true }; // Only published videos by default

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
        ];
    }

    if (userId) {
        filter.owner = userId;
    }

    // Build sort object
    let sortCondition = {};
    if (sortBy && sortType) {
        sortCondition[sortBy] = sortType.toLowerCase() === "asc" ? 1 : -1;
    } else {
        sortCondition.createdAt = -1; // default: latest first
    }

    // Fetch videos with pagination
    const videos = await Video.find(filter)
        .populate("owner", "username email avatar")
        .sort(sortCondition)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const totalVideos = await Video.countDocuments(filter);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    page: pageNumber,
                    totalPages: Math.ceil(totalVideos / limitNumber),
                    totalVideos,
                    videos,
                },
                "Videos fetched successfully"
            )
        );
})

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and Description are required");
    }

    const videoFile = req.files?.videoFile?.[0]?.path;
    const thumbnail = req.files?.thumbnail?.[0]?.path;

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "video and thumbnail are required")
    }

    //upload to cloudinary
    const videoUpload = await uploadOnCloudinary(videoFile)
    const thumbnailUpload = await uploadOnCloudinary(thumbnail)

    if (!videoUpload) {
        throw new ApiError(500, "Error in uploading video");
    }

    if (!thumbnailUpload) {
        throw new ApiError(500, "Error in uploading thumbnail");
    }

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        duration: videoUpload.duration,
        owner: req.user?._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, newVideo, "Video uploaded successfully")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId).populate("owner", "userName email avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.views = video.views + 1;
    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        )

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video Id not found");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Updation not allowed");
    }

    const { title, description } = req.body
    const newThumbnailFile = req.files?.thumbnail?.[0]?.path;

    //if thumbnail is provided,upload new one
    if (newThumbnailFile) {
        const newThumbnailUpload = await uploadOnCloudinary(newThumbnailFile)

        if (!newThumbnailUpload) {
            throw new ApiError(500, "Error in uploading thumbnail")
        }

        video.thumbnail = newThumbnailUpload.url
    }

    //update text fields if provided
    if (title) video.title = title
    if (description) video.description = description



    if (!title && !description && !newThumbnailFile) {
        throw new ApiError(400, "No fields provided to update")
    }


    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video updated successfully")
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Deletion not allowed");
    }

    await video.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video deleted successfully")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Action not allowed");
    }

    //flip
    video.isPublished = !video.isPublished;

    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isPublished: video.isPublished }, "Publish status updated")
        )
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}