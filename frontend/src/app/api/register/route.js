import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { addUser, findUserByEmail, findUserByUsername } from "@/data/user-store";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ msg: "No JSON data received or malformed JSON." }, { status: 400 });
  }

  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ msg: "Missing required fields: username, email, password" }, { status: 400 });
  }

  if (findUserByEmail(email)) {
    return NextResponse.json({ msg: "Email already exists" }, { status: 400 });
  }

  if (findUserByUsername(username)) {
    return NextResponse.json({ msg: "Username taken" }, { status: 400 });
  }

  addUser({
    id: randomUUID(),
    username,
    email,
    password,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ msg: "User successfully registered" }, { status: 200 });
}
