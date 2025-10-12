import mongoose, { Schema } from "mongoose";

const NodeSchema = new Schema({
  name: { type: String, required: true },
  coordinates: {
    type: [Number],
    required: true,
  },
});

export default mongoose.models.Node || mongoose.model("Node", NodeSchema);
