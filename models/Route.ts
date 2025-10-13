import mongoose, { Schema } from "mongoose";

const RouteSchema = new Schema({
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  nodes: [{ type: Schema.Types.ObjectId, ref: "Node" }],
  totalDistance: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "active", "completed"], default: "pending" },
  startedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Route || mongoose.model("Route", RouteSchema);
