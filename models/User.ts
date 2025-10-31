import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "operator", "citizen"],
            default: "citizen",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
        createdAt: { type: Date, default: Date.now },
    },
    { minimize: true }
);

// Indexes for faster lookups and uniqueness guarantees
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
