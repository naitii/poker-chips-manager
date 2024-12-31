import mongoose from "mongoose";
const { Schema } = mongoose;

const PlayerSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  acceptWinner: { type: Boolean, required: true, default: false },
});

export default mongoose.model("Player", PlayerSchema);
