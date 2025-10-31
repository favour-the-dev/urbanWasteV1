import mongoose, { Schema } from "mongoose";

const NodeSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    { minimize: true }
);

NodeSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Node || mongoose.model("Node", NodeSchema);
