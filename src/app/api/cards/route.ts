import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET all cards for the logged-in user
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const cards = await prisma.card.findMany({
            where: { userId: session.user.id },
        });
        return NextResponse.json(cards);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
    }
}

// POST a new card
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, dueDay, color } = await req.json();
        if (!name || !dueDay || !color) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newCard = await prisma.card.create({
            data: {
                name,
                dueDay: parseInt(dueDay, 10),
                color,
                userId: session.user.id,
            },
        });
        return NextResponse.json(newCard, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
    }
}

// PUT (update) an existing card
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, name, dueDay, color } = await req.json();
        if (!id || !name || !dueDay || !color) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedCard = await prisma.card.update({
            where: { id: id },
            data: { name, dueDay: parseInt(dueDay, 10), color },
        });
        return NextResponse.json(updatedCard);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
    }
}

// DELETE a card
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "Card ID is required" }, { status: 400 });
        }

        await prisma.card.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: "Card deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
    }
} 