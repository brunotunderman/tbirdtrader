import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const SECRET = process.env.SESSION_SECRET || "dev-secret";

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

export async function getSession(token: string) {
  try {
    const decoded: any = jwt.verify(token, SECRET);

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

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.set("session", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
