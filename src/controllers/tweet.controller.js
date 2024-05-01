import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const tweet = await Tweet.create({ content, owner: userId });

  if (!tweet) {
    throw new ApiError(400, "Failed to create tweet on server");
  }

  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tweets = await Tweet.find({ owner: userId });

  return res.status(200).json(new ApiResponse(200, tweets, "All user tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: userId },
    { content },
    { new: true }
  );
  if (!tweet) {
    throw new ApiError(404, "No Tweet found to update");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { tweetId } = req.params;

  const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: userId });
  if (!tweet) {
    throw new ApiError(404, "No tweet found to delete");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
