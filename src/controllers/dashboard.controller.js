import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.body;

  const videos = await Video.find({
    owner: channelId,
    isPublished: true,
  }).exec();

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All videos of channel"));
});

export { getChannelStats, getChannelVideos };
