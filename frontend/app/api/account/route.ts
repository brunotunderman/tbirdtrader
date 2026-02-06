import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_BASE_URL ?? "http://localhost:8000";

export async function GET(_req: NextRequest) {
  try {
    const r = await fetch(`${BACKEND}/paper/account`, { cache: "no-store" });
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return NextResponse.json(
        { error: "Account backend error", status: r.status, details: text },
        { status: 502 }
      );
    }
    const data = await r.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Backend unreachable", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}