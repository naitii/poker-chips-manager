import mongoose from "mongoose";
import shortid from "shortid";
const { Schema } = mongoose;

const GameSchema = new Schema(
  {
    name: { type: String, required: true },
    pot: { type: Number, required: true, default: 0 },
    initialAmount: { type: Number, required: true },
    password: { type: String, required: true },
    maxPlayers: { type: Number, required: true, default: 8 },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Game", GameSchema);
