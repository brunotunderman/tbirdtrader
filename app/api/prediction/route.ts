export async function GET() {
  return Response.json({
    timestamp: Math.floor(Date.now() / 1000),
    price: 50000,
    high: 50500,
    low: 49500
  });
}
