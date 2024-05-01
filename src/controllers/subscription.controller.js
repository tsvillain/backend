import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { _id: userId } = req.user;

  const sub = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (sub) {
    await Subscription.findByIdAndDelete(sub._id);
  } else {
    await Subscription.create({ channel: channelId, subscriber: userId });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscribe to the channel successfully"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
