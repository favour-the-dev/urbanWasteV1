import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import UserModel from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, role } = body;
  if (!email || !password || !name) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  await connectToDB();
  const exists = await UserModel.findOne({ email });
  if (exists) return NextResponse.json({ error: "email exists" }, { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  const user = new UserModel({ name, email, password: hashed, role });
  await user.save();
  return NextResponse.json({ ok: true });
}
