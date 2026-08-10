import { connectDB } from "@/lib/mongodb1"
import Member from "@/models/members"
import { NextResponse } from "next/server"

// ১. নির্দিষ্ট এক জন মেম্বারের তথ্য বের করা (GET)
export async function GET(req, { params }) {
  try {
    const { id } = await params
    await connectDB()
    const member = await Member.findById(id)
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }
    return NextResponse.json(member, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ২. নতুন জমা/উত্তোলন যোগ করা (POST)
export async function POST(req, { params }) {
  try {
    const { id } = await params
    const { date, joma, uttolon, comments } = await req.json()
    await connectDB()

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        $push: {
          transactions: { date, joma, uttolon, comments },
        },
      },
      { new: true }
    )

    return NextResponse.json(updatedMember, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ৩. ট্রানজেকশন এডিট এবং ডিলেট করা (PUT)
export async function PUT(req, { params }) {
  try {
    const { id } = await params
    const body = await req.json()
    await connectDB()

    if (body.action === "delete") {
      // ট্রানজেকশন মুছে ফেলা
      const updated = await Member.findByIdAndUpdate(
        id,
        { $pull: { transactions: { _id: body.transactionId } } },
        { new: true }
      )
      return NextResponse.json(updated, { status: 200 })
    }

    if (body.action === "edit") {
      // ট্রানজেকশন এডিট করা
      const updated = await Member.findOneAndUpdate(
        { _id: id, "transactions._id": body.transactionId },
        {
          $set: {
            "transactions.$.date": body.date,
            "transactions.$.joma": body.joma,
            "transactions.$.uttolon": body.uttolon,
            "transactions.$.comments": body.comments,
          },
        },
        { new: true }
      )
      return NextResponse.json(updated, { status: 200 })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}