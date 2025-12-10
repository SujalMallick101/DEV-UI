import { Subscription } from "../models/subscription.models.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    //get channelId
    //validate it
    //ensure that cannot subscribed to yourself
    //check if subscription already exist
    //if subscription exists-unsubscribe
    //create new subscription

    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel Id is required");
    }

    if (channelId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const existing = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (existing) {
        await existing.deleteOne();
        return res
            .status(200)
            .json(
                new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
            )
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribed: true }, "Subscribed Successfully")
        )

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    //get channel id
    //validate it
    //check for channel exists
    //find all subscribers of this channel

    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "channel id is required");
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "userName email avatar");


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { totalSubscribers: subscribers.length, subscribers },
                "Subscribers fetched successfully"
            )
        )

})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    //get subscriber id
    //validate
    //check if subscriber exist
    //find all channels that is subscribed to

    const { subscriberId } = req.params;

    if (!subscriberId) {
        throw new ApiError(400, "Subscriber Id is required");
    }

    const subscriber = await User.findById(subscriberId);

    if (!subscriber) {
        throw new ApiError(404, "subscriber not found");
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "userName email avatar");


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { totalChannels: subscribedChannels.length, subscribedChannels },
                "Subscribed channels fetched successfully"
            )
        )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}