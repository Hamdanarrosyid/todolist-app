import { NextResponse } from "next/server";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CreateTodoValidation } from "@/validation/createTodovalidation";


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
    if (!todo.length) return NextResponse.json({ error: "Todo tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ data: todo[0] });
  } catch (error) {
    console.log("GET Todo Error:", error);
    return NextResponse.json({ error: "Gagal mengambil todo"  }, { status: 400 });
  }
}

// UPDATE TODO
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json();
    const validatedData = CreateTodoValidation.safeParse(body);

    if (!validatedData.success) {
        return NextResponse.json({ error: validatedData.error.errors }, { status: 400 });
    }

    const updated = await db.update(todos).set(validatedData.data).where(eq(todos.id, id)).returning();
    if (!updated.length) return NextResponse.json({ error: "Todo tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ data: updated[0] });
  } catch (error) {
    console.log("PUT Todo Error:", error);  
    return NextResponse.json({ error: "Gagal mengupdate todo" }, { status: 400 });
  }
}

// DELETE TODO
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const deleted = await db.delete(todos).where(eq(todos.id, id)).returning();
    if (!deleted.length) return NextResponse.json({ error: "Todo tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ message: "Todo berhasil dihapus" });
  } catch (error) {
    console.log("DELETE Todo Error:", error);
    return NextResponse.json({ error: "Gagal delete todo" }, { status: 400 });
  }
}
