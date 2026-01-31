import { db } from "@/db/db";
import { todos } from "@/db/schemas/todos";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.select().from(todos).orderBy(desc(todos.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 },
      );
    }
    const [result] = await db
      .insert(todos)
      .values({ text: text.trim() })
      .returning();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 },
    );
  }
}
