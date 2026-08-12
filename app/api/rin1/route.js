import { connectDB } from "@/lib/mongodb1"
import Rinmember from "@/models/rinmembers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    // order ফিল্ড অনুযায়ী সর্ট হবে
    const members = await Rinmember.find({}).sort({ order: 1, createdAt: -1 })
    return NextResponse.json(members, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { name, adress, phone, ashol, lab, date } = await req.json()
    await connectDB()
    const newMember = await Rinmember.create({
      name,
      adress,
      phone,
      ashol: Number(ashol) || 0,
      lab: Number(lab) || 0,
      date,
    })
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const body = await req.json()
    await connectDB()

    // 🔹 Drag & Drop Reorder হ্যান্ডেল করার জন্য
    if (body.action === "reorder") {
      const { items } = body
      const updatePromises = items.map((item) =>
        Rinmember.findByIdAndUpdate(item._id, { order: item.order })
      )
      await Promise.all(updatePromises)
      return NextResponse.json({ message: "Order updated successfully" }, { status: 200 })
    }

    // 🔹 সাধারণ Edit/Update হ্যান্ডেল করার জন্য
    const { id, name, adress, phone, ashol, lab, date } = body
    const updated = await Rinmember.findByIdAndUpdate(
      id,
      { name, adress, phone, ashol: Number(ashol) || 0, lab: Number(lab) || 0, date },
      { new: true }
    )
    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()
    await connectDB()
    await Rinmember.findByIdAndDelete(id)
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}