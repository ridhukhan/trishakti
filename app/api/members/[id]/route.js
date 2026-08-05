// app/api/members/[id]/route.js
import { connectDB } from "@/lib/mongodb"
import Member from "@/models/members"
import { NextResponse } from "next/server"

// মেম্বারের তথ্য ও ট্রানজেকশন লোড করার জন্য
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

// নতুন ট্রানজেকশন যোগ করার জন্য
export async function POST(req, { params }) {
  try {
    const { id } = await params
    const { date, joma, uttolon } = await req.json()
    await connectDB()

    // মেম্বারের transactions অ্যারেতে নতুন ডাটা push করা হচ্ছে
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