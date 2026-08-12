import { connectDB } from "@/lib/mongodb1"
import Member3 from "@/models/Member3"
import { NextResponse } from "next/server"

// সব মেম্বার এর ডাটা পাওয়ার জন্য
export async function GET() {
  try {
    await connectDB()
    const members = await Member3.find({})
    return NextResponse.json(members, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// নতুন মেম্বার যুক্ত করার জন্য
export async function POST(req) {
  try {
    const { name, adress, phone } = await req.json()
    await connectDB()
    const newMember = await Member3.create({ name, adress, phone })
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// মেম্বার এর তথ্য (নাম, ঠিকানা, ফোন) আপডেট করার জন্য
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
    const updated = await Member3.findByIdAndUpdate(id, { name, adress, phone }, { new: true })
    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


// মেম্বার রিমুভ/ডিলিট করার জন্য
export async function DELETE(req) {
  try {
    const { id } = await req.json()
    await connectDB()
    await Member3.findByIdAndDelete(id)
    return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}