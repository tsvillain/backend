import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { _id } = req.user;
  if (!name || !description) {
    throw new ApiError(400, "name and description are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: _id,
    videos: [],
  });

  if (!playlist) {
    throw new ApiError(500, "Failed to create playlist");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "playlistId and videoId is required");
  }

  const { _id } = req.user;

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: _id,
    },
    {
      $push: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!playlist) {
    throw new ApiError(
      401,
      "Can't add the video to the playlist, please check the owner is correct"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video added to playlist."));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "playlistId and videoId is required");
  }

  const { _id } = req.user;

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: _id,
    },
    {
      $pop: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!playlist) {
    throw new ApiError(
      401,
      "Can't add the video to the playlist, please check the owner is correct"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video removed from playlist."));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { _id: ownerId } = req.user;
  if (!playlistId) {
    throw new ApiError(400, "playlistId is required");
  }

  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: ownerId,
  });
  if (!playlist) {
    throw new ApiError(
      404,
      "No playlist found to delete, plesse check owner is correct"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const { _id: ownerId } = req.user;
  if (!name || !description) {
    throw new ApiError(400, "name and description is required");
  }

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: ownerId,
    },
    {
      name,
      description,
    },
    { new: true }
  );

  if (!playlist) {
    throw new ApiError(404, "No playlist found to update");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
