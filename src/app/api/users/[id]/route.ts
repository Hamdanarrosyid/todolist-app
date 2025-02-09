import { db } from "@/db";
import { users } from "@/db/schema";
import { CreateUserValidation } from "@/validation/createUserValidation";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const IdSchema = z.string().uuid();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const validatedId = IdSchema.safeParse(params.id);
        if (!validatedId.success) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, params.id), with: {
                address: true,
            }
        });
        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("GET User by ID Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const validatedId = IdSchema.safeParse(params.id);
        if (!validatedId.success) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const body = await req.json();
        const validatedData = CreateUserValidation.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.errors }, { status: 400 });
        }

        await db.update(users).set(validatedData.data).where(eq(users.id, params.id));

        return NextResponse.json({ message: "User berhasil diperbarui" }, { status: 200 });
    } catch (error) {
        console.error("PUT User Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const deleted = await db.delete(users).where(eq(users.id, id)).returning();
    if (!deleted.length) return NextResponse.json({ error: "Todo tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ message: "Todo berhasil dihapus" });
  } catch (error) {
    console.log("DELETE Todo Error:", error);
    return NextResponse.json({ error: "Gagal delete todo" }, { status: 400 });
  }
}
