import mongoose, { Schema, Document, models, model } from "mongoose"

export interface ITeam extends Document {
  team_name: string
  track: string
  rounds_accessible: mongoose.Types.ObjectId[]
  created_at: Date
  is_locked: boolean
  is_shortlisted: boolean
  is_eliminated: boolean
}

const TeamSchema = new Schema<ITeam>({
  team_name: { type: String, required: true },
  track: { type: String, required: true },
  rounds_accessible: [
    { type: Schema.Types.ObjectId, ref: "Round" },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_locked: { type: Boolean, default: false },
  is_shortlisted: { type: Boolean, default: false },
  is_eliminated: { type: Boolean, default: false },
})

export default models.Team || model<ITeam>("Team", TeamSchema)