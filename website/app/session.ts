import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

// The secret used to sign and verify session tokens.
// Make sure this matches your .env value.
const SECRET = process.env.SESSION_SECRET || "dev-secret";

// ---------------------------------------------------------------------------
// Create a session token for a user
// ---------------------------------------------------------------------------
export function createSession(user: any) {
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      profileType: user.profileType,
      transactionFeeRate: user.transactionFeeRate,
    },
    SECRET,
    { expiresIn: "7d" }
  );

  return token;
}

// ---------------------------------------------------------------------------
// Read and validate a session token
// ---------------------------------------------------------------------------
export async function getSession(token: string) {
  try {
    const decoded: any = jwt.verify(token, SECRET);

    // Fetch fresh user data from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        profileType: true,
        transactionFeeRate: true,
      },
    });

    if (!user) return null;

    return { user };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Destroy session cookie
// ---------------------------------------------------------------------------
export function destroySession() {
  const cookieStore = cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
