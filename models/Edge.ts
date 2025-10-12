import mongoose, { Schema } from "mongoose";

const EdgeSchema = new Schema({
  fromNode: { type: Schema.Types.ObjectId, ref: "Node", required: true },
  toNode: { type: Schema.Types.ObjectId, ref: "Node", required: true },
  weight: { type: Number, required: true },
});

export default mongoose.models.Edge || mongoose.model("Edge", EdgeSchema);
