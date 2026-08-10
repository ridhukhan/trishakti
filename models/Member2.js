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

const Member2Schema = new mongoose.Schema(
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


// "Member2" মডেল হিসেবে মঙ্গোডিবিতে 'member2' কালেকশন তৈরি করবে
export default mongoose.models.Member2 || mongoose.model("Member2", Member2Schema)