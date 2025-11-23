import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    phoneNumber: { type: String },
    languagePreference: { type: String, default: "en" },
  },
  {
    timestamps: true,
  },
);

export const UserModel = models.User || model("User", userSchema);


