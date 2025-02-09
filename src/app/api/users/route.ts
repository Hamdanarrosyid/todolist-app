import { db } from "@/db";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc, ilike } from "drizzle-orm";
import { CreateUserValidation } from "@/validation/createUserValidation";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = 5;
        const offset = (page - 1) * limit;
        const search = searchParams.get("search") || "";
        const count = await db.$count(users)

        const result = await db
            .select()
            .from(users)
            .where(ilike(users.firstname, `%${search}%`))
            .limit(limit)
            .offset(offset)
            .orderBy(desc(users.created_at));

        return NextResponse.json({
            data: result,
            page,
            limit,
            total: Math.ceil(count / limit),
        }, { status: 200 });
    } catch (error) {
        console.error("GET Users Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = CreateUserValidation.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.errors }, { status: 400 });
        }

        await db.insert(users).values(validatedData.data);
        return NextResponse.json(validatedData.data, { status: 201 });
    } catch (error) {
        console.error("POST User Error:", error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}