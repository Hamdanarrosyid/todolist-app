import { NextResponse } from "next/server";
import { db } from "@/db";
import { todos, users } from "@/db/schema";
import { CreateTodoValidation } from "@/validation/createTodovalidation";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id')

        if (user_id) {
            const user = await db.query.users.findFirst({ where: eq(users.id, user_id) });
            if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

            const allTodos = await db.select().from(todos).where(eq(todos.user_id, user_id)).orderBy(desc(todos.created_at));
            return NextResponse.json(allTodos);
        } else {
            const allTodos = await db.select().from(todos);
            return NextResponse.json(allTodos);
        }

    } catch (error) {
        console.log("GET Todos Error:", error);
        return NextResponse.json({ error: "Gagal mengambil todos" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = CreateTodoValidation.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.errors }, { status: 400 });
        }

        const newTodo = await db.insert(todos).values(validatedData.data).returning();
        return NextResponse.json({ data: newTodo[0] }, { status: 201 });
    } catch (error) {
        console.log("POST Todos Error:", error);
        return NextResponse.json({ error: "Gagal menambah todos" }, { status: 400 });
    }
}
