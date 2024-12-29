import mongoose from "mongoose";
const { Schema } = mongoose;

const PlayerSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
});

export default mongoose.model("Player", PlayerSchema);
