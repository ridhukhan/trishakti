import { connectDB } from "@/lib/mongodb1"
import Rinmember from "@/models/rinmembers"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    const { id } = await params
    await connectDB()
    const member = await Rinmember.findById(id)
    return NextResponse.json(member, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Add Transaction
export async function POST(req, { params }) {
  try {
    const { id } = await params
    const { date, joma, comments } = await req.json()
    await connectDB()

    const updatedMember = await Rinmember.findByIdAndUpdate(
      id,
      {
        $push: {
          transactions: {
            date,
            joma: Number(joma) || 0,
            comments: comments || "",
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

// Edit or Delete Transaction
export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const { action, transactionId, date, joma, comments } = await req.json()
    await connectDB()

    if (action === "edit") {
      const updatedMember = await Rinmember.findOneAndUpdate(
        { _id: id, "transactions._id": transactionId },
        {
          $set: {
            "transactions.$.date": date,
            "transactions.$.joma": Number(joma) || 0,
            "transactions.$.comments": comments || "",
          },
        },
        { new: true }
      )
      return NextResponse.json(updatedMember, { status: 200 })
    }

    if (action === "delete") {
      const updatedMember = await Rinmember.findByIdAndUpdate(
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