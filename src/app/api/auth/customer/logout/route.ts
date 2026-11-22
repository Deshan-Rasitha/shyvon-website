import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("shyvon_customer_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
