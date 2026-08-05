import { connectDB } from "@/lib/mongodb"
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
    const { name, adress } = await req.json()
    await connectDB()
    const newMember = await Member.create({ name, adress })
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { id, name, adress } = await req.json()
    await connectDB()
    const updated = await Member.findByIdAndUpdate(id, { name, adress }, { new: true })
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