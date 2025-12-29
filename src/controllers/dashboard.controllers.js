import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Like } from "../models/like.models.js";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";

const getChannelStats = asyncHandler(async (req, res) => {
    //get channel id from req.user
    //validate
    //count total videos
    //count total likes
    //count total views
    //count total subscribers
    //return response

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, 'User Id is required');
    }

    const totalVideos = await Video.countDocuments({
        owner: userId
    })

    const viewsResult = await Video.aggregate([
        { $match: { owner: userId } },
        {
            $group: {
                _id: null,
                totalViews: { $sum: '$views' }
            }
        }
    ]);

    const totalViews = viewsResult[0]?.totalViews || 0;

    const videoIds = await Video.find(
        { owner: userId },
        { _id: 1 }
    );

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalVideos,
                    totalViews,
                    totalLikes,
                    totalSubscribers
                },
                "Channel stats fetched successfully"
            )
        )
});

const getChannelVideos = asyncHandler(async (req, res) => {
    //get channel id
    //validate
    //check channel exists
    //fetch videos
    //return response

    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, 'Channel Id is required');
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, 'Channel not found');
    }

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalVideos: videos.length,
                    videos
                },
                "Channel videos fetched successfully"
            )
        )
})

export {
    getChannelStats,
    getChannelVideos
}