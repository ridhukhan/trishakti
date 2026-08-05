import { connectDB } from "@/lib/mongodb"
import Member from "@/models/members"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const { id } = await params
    await connectDB()
    const member = await Member.findById(id)
    return NextResponse.json(member, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// নতুন Transaction যোগ করা
export async function POST(req, { params }) {
  try {
    const { id } = await params
    const { date, joma, uttolon } = await req.json()
    await connectDB()

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        $push: {
          transactions: {
            date,
            joma: Number(joma) || 0,
            uttolon: Number(uttolon) || 0,
          },
        },
      },
      { new: true }
    )

    return NextResponse.json(updatedMember, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Transaction আপডেট (Edit) ও ডিলিট করার জন্য
export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const { action, transactionId, date, joma, uttolon } = await req.json()
    await connectDB()

    if (action === "edit") {
      // নির্দিষ্ট Transaction আপডেট
      const updatedMember = await Member.findOneAndUpdate(
        { _id: id, "transactions._id": transactionId },
        {
          $set: {
            "transactions.$.date": date,
            "transactions.$.joma": Number(joma) || 0,
            "transactions.$.uttolon": Number(uttolon) || 0,
          },
        },
        { new: true }
      )
      return NextResponse.json(updatedMember, { status: 200 })
    }

    if (action === "delete") {
      const updatedMember = await Member.findByIdAndUpdate(
        id,
        { $pull: { transactions: { _id: transactionId } } },
        { new: true }
      )
      return NextResponse.json(updatedMember, { status: 200 })
    }

    return NextResponse.json({ error: "Invalid Action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}