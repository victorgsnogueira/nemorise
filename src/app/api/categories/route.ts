import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const categories = await prisma.category.findMany({
            where: {
                userId: session.user.id,
            },
        });
        return NextResponse.json(categories);
    } catch {
        return NextResponse.json(
            { error: "An error occurred while fetching categories." },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, type, color } = body;

        if (!name || !type || !color) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                type,
                color,
                userId: session.user.id,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An error occurred while creating the category." },
            { status: 500 }
        );
    }
} 