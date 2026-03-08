import { NextResponse } from "next/server";
import { findUserByEmail } from "@/data/user-store";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ msg: "No JSON data received or malformed JSON." }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ msg: "Missing required fields: email, password" }, { status: 400 });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ msg: "User does not exist" }, { status: 400 });
  }

  if (user.password !== password) {
    return NextResponse.json({ msg: "Wrong password" }, { status: 400 });
  }

  return NextResponse.json({ msg: "Logged in successfully" }, { status: 200 });
}
