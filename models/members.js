import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  joma: {
    type: Number,
    default: 0,
  },
  uttolon: {
    type: Number,
    default: 0,
  },
})

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
)

export default mongoose.models.member || mongoose.model("member", memberSchema)