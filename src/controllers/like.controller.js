import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user;

  const liked = await Like.findOne({ video: videoId, likedBy: _id });

  if (liked) {
    await Like.findByIdAndDelete(liked._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed successfully"));
  } else {
    const like = await Like.create({ video: videoId, likedBy: _id });

    return res
      .status(200)
      .json(new ApiResponse(200, like, "Liked added successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { _id } = req.user;

  const liked = await Like.findOne({ comment: commentId, likedBy: _id });

  if (liked) {
    await Like.findByIdAndDelete(liked._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed successfully"));
  } else {
    const like = await Like.create({ comment: commentId, likedBy: _id });

    return res
      .status(200)
      .json(new ApiResponse(200, like, "Liked added successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { _id } = req.user;

  const liked = await Like.findOne({ tweet: tweetId, likedBy: _id });

  if (liked) {
    await Like.findByIdAndDelete(liked._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed successfully"));
  } else {
    const like = await Like.create({ tweet: tweetId, likedBy: _id });

    return res
      .status(200)
      .json(new ApiResponse(200, like, "Liked added successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const videos = await Like.aggregate([
    {
      $match: {
        likedBy: _id,
        video: {
          $exist: true,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $project: {
        video: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All Videos liked by user"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
