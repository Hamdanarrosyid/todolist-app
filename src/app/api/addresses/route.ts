import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { addresses, users } from "@/db/schema";
import {CreateAddressValidation} from "@/validation/createAddressValidation";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allAddress = await db.select().from(addresses);
    return NextResponse.json(allAddress, { status: 200 });
  } catch (error) {
    console.error("GET Address Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data address" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = CreateAddressValidation.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    const user = await db.query.users.findFirst({where: eq(users.id, validation.data.user_id)});
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    await db.insert(addresses).values(validation.data);

    return NextResponse.json(validation.data, { status: 201 });
  } catch (error) {
    console.error("POST Address Error:", error);
    return NextResponse.json({ error: "Gagal menambah address" }, { status: 500 });
  }
}
