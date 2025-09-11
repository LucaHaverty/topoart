import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const locations = searchParams.get("locations");

  if (!locations) {
    return NextResponse.json(
      { error: "Missing 'locations' query parameter" },
      { status: 400 }
    );
  }

  try {
    // Forward request to OpenTopoData
    const url = `https://api.opentopodata.org/v1/aster30m?locations=${locations}`;
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch elevation data" },
      { status: 500 }
    );
  }
}
