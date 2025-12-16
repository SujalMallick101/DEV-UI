import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";


const createTweet = asyncHandler(async (req, res) => {
    //get content
    //validate
    //create it 
    //return res

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, tweet, "Tweet created successfully")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    //get user id
    //validate
    //check user exists
    //fetch tweets
    //return res

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { totalTweets: tweets.length, tweets },
                "User tweets fetched successfully"
            )
        )

})

const updateTweet = asyncHandler(async (req, res) => {
    //get content,tweetId
    //validate
    //match tweet
    //check for updation allowance
    //update and save
    //return res

    const { content } = req.body;
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required");
    }

    if (!content) {
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Updation not allowed");
    }

    tweet.content = content
    await tweet.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Tweet updated successfully")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //get tweetId
    //validate
    //match tweet
    //ownership checking
    //delete tweet
    //return res

    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Deletion not allowed");
    }

    await tweet.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Tweet deleted successfully")
        )
})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}