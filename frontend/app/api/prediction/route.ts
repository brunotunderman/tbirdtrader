export async function GET() {
  const backendUrl = `http://localhost:8000/model/predict?symbol=BTC-EUR&model=baseline`;

  try {
    const res = await fetch(backendUrl);
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: "Backend unreachable", details: String(err) }, { status: 500 });
  }
}

