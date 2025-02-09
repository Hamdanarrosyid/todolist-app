import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { addresses} from "@/db/schema";
import { eq } from "drizzle-orm";
import { CreateAddressValidation } from "@/validation/createAddressValidation";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await db.select().from(addresses).where(eq(addresses.id, (await params).id));

    if (!result.length) {
      return NextResponse.json({ error: "Address tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("GET Address by ID Error:", error);
    return NextResponse.json({ error: "Gagal mengambil address" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const validation = CreateAddressValidation.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    const updated = await db.update(addresses).set(body).where(eq(addresses.id, (await params).id)).returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Address tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error("PUT Address Error:", error);
    return NextResponse.json({ error: "Gagal mengupdate address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const deleted = await db.delete(addresses).where(eq(addresses.id, (await params).id)).returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Address tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Address Error:", error);
    return NextResponse.json({ error: "Gagal menghapus address" }, { status: 500 });
  }
}
