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
  comments:{
    type:String,
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
    phone:{
       type: String,
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
)

export default mongoose.models.Member || mongoose.model("Member", memberSchema)