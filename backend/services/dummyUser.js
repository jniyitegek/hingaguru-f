import { UserModel } from "../models/User.js";

let cachedUser = null;

export async function ensureDummyUser() {
  if (cachedUser) {
    return cachedUser;
  }

  const email = process.env.DUMMY_USER_EMAIL ?? "demo@hingaguru.com";
  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      name: process.env.DUMMY_USER_NAME ?? "Demo Farmer",
      email,
      passwordHash: "dummy-hash",
      phoneNumber: process.env.DUMMY_USER_PHONE ?? "+250700000000",
      languagePreference: "en",
    });
  }

  cachedUser = user;
  return cachedUser;
}

export function getDummyUserId() {
  if (!cachedUser) {
    throw new Error("Dummy user not initialised");
  }
  return cachedUser._id;
}


