import { connectDB } from "@/lib/mongodb1"
import Member2 from "@/models/members2"
import { NextResponse } from "next/server"

// GET: Order অনুযায়ী সর্ট করে ডাটা লোড করবে
export async function GET() {
  try {
    await connectDB()
    const members = await Member2.find({}).sort({ order: 1 })
    return NextResponse.json(members, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: নতুন মেম্বার যুক্ত করার সময় শেষ order দিয়ে সেভ করবে
export async function POST(req) {
  try {
    const { name, adress, phone } = await req.json()
    await connectDB()
    const count = await Member2.countDocuments()
    const newMember = await Member2.create({ name, adress, phone, order: count })
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: সাধারণ এডিট অথবা রিঅর্ডার লজিক
export async function PUT(req) {
  try {
    const body = await req.json()
    await connectDB()

    // 🔹 Drag & Drop এর সময় সিরিয়াল ডাটাবেজে আপডেট করা
    if (body.action === "reorder") {
      const { items } = body
      const updatePromises = items.map((item, index) =>
        Member2.findByIdAndUpdate(item._id, { order: index })
      )
      await Promise.all(updatePromises)
      return NextResponse.json({ message: "Order updated successfully" }, { status: 200 })
    }

    // 🔹 সাধারণ মেম্বার এডিট (নাম, ঠিকানা, ফোন)
    const { id, name, adress, phone } = body
    const updated = await Member2.findByIdAndUpdate(id, { name, adress, phone }, { new: true })
    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    await connectDB()
    await Member2.findByIdAndDelete(id)
    return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}