import mongoose from 'mongoose';
import shortid from 'shortid';
const {Schema} = mongoose;

const GameSchema = new Schema({
  _id: { type: Number, required: true, default: shortid.generate },
  pot: { type: Number, required: true, default: 0 },
  players: { type: Array, required: true, default: [] },
  initialAmount: { type: Number, required: true },
  password: { type: String, required: true },
  maxPlayers: { type: Number, required: true },
}, {timestamps: true});

export default mongoose.model('Game', GameSchema);