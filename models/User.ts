import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "operator"], default: "operator" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
