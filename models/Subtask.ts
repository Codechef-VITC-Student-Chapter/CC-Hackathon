import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ISubtask extends Document {
  title: string;
  description: string;
  track_id: mongoose.Types.ObjectId;
  round_id: mongoose.Types.ObjectId;
  is_active: boolean;
  created_at: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    track_id: {
      type: Schema.Types.ObjectId,
      ref: "Track",
      required: true,
    },
    round_id: {
      type: Schema.Types.ObjectId,
      ref: "Round",
      required: true,
    },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: "subtasks",
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
);

export default models.Subtask || model<ISubtask>("Subtask", SubtaskSchema);
