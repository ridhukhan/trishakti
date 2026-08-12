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
  comments: {
    type: String,
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
    phone: {
      type: String,
    },
    order: {
      type: Number,
      default: 0, // 👈 পজিশন ট্র্যাক করার ফিল্ড
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
)

export default mongoose.models.Member || mongoose.model("Member", memberSchema)