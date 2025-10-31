import mongoose, { Schema } from "mongoose";

const RouteSchema = new Schema(
    {
        assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
        nodes: [{ type: Schema.Types.ObjectId, ref: "Node" }],
        totalDistance: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["pending", "active", "completed"],
            default: "pending",
        },
        startedAt: { type: Date },
        completedAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
    },
    { minimize: true }
);

RouteSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });
RouteSchema.index({ status: 1, completedAt: -1 });
RouteSchema.index({ createdAt: -1 });

export default mongoose.models.Route || mongoose.model("Route", RouteSchema);
