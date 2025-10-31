import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema(
    {
        citizenId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: {
            type: String,
            enum: [
                "Full Bin",
                "Flooding",
                "Road Block",
                "Damaged Bin",
                "Other",
            ],
            required: true,
        },
        description: { type: String, required: true },
        location: { type: String },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number },
        },
        imageUrl: { type: String },
        status: {
            type: String,
            enum: ["pending", "reviewing", "resolved", "rejected"],
            default: "pending",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        adminNotes: { type: String },
        resolvedAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { minimize: true }
);

ReportSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Indexes to support filters and recent queries
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ priority: 1 });
ReportSchema.index({ status: 1, priority: 1 });

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
