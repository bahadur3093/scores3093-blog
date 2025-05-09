import mongoose, { Schema } from "mongoose";

const TokenBlacklistSchema = new Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.model(
  "TokenBlacklist",
  TokenBlacklistSchema
);
