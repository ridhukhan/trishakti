import mongoose from "mongoose"

const rintransactionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  joma: {
    type: Number,
    default: 0,
  },
  comments: {
    type: String,
  },
})

const rinmemberSchema = new mongoose.Schema(
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
    ashol: {
      type: Number,
      default: 0,
    },
    lab: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: true,
    },
    transactions: [rintransactionSchema],
  },
  { timestamps: true }
)

export default mongoose.models.Rinmember || mongoose.model("Rinmember", rinmemberSchema)