import mongoose from "mongoose";

const DailyProgressSchema = new mongoose.Schema({
  dailyPoints: { type: Number, required: true },
  stepsWalked: { type: Number, required: true },
  timestamp: { type: Date, default: new Date("1900-01-01T00:00:00Z"), unique: true }, // Ensure unique timestamps for daily records
});

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  totalPoints: { type: Number, default: 0 },
  dailyProgress: [DailyProgressSchema], // Adding daily progress records
});

const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", UserSchema);

export default UserModel;