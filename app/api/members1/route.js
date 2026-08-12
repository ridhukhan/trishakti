import { connectDB } from "@/lib/mongodb1"
import Member from "@/models/members"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const members = await Member.find({})
    return NextResponse.json(members, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { name, adress,phone } = await req.json()
    await connectDB()
    const newMember = await Member.create({ name, adress,phone })
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const body = await req.json()
    await connectDB()

    // 🔹 Drag & Drop এর সময় সিরিয়াল ডাটাবেজে আপডেট করা
    if (body.action === "reorder") {
      const { items } = body
      const updatePromises = items.map((item, index) =>
        Member.findByIdAndUpdate(item._id, { order: index })
      )
      await Promise.all(updatePromises)
      return NextResponse.json({ message: "Order updated successfully" }, { status: 200 })
    }

    // 🔹 সাধারণ মেম্বার এডিট (নাম, ঠিকানা, ফোন)
    const { id, name, adress, phone } = body
    const updated = await Member.findByIdAndUpdate(id, { name, adress, phone }, { new: true })
    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


export async function DELETE(req) {
  try {
    const { id } = await req.json()
    await connectDB()
    await Member.findByIdAndDelete(id)
    return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}