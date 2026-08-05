import { connectDB } from "@/lib/mongodb"
import Member from "@/models/members"
import { NextResponse } from "next/server"

export async function GET() {
  await connectDB()
  const members = await Member.find({})
  return NextResponse.json(members)
}

export async function POST(req) {
  const { name, adress } = await req.json()
  await connectDB()
  const newMember = await Member.create({ name, adress })
  return NextResponse.json(newMember)
}