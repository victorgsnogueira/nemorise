import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const incomes = await prisma.income.findMany({
            where: { userId: session.user.id },
            include: { category: true },
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(incomes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch incomes" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            description,
            amount,
            date,
            isReceived,
            notes,
            categoryId,
        } = body;

        // Basic validation
        if (!description || !amount || !date || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const income = await prisma.income.create({
            data: {
                description,
                amount: parseFloat(amount),
                date: new Date(date),
                isReceived: Boolean(isReceived),
                notes,
                userId: session.user.id,
                categoryId,
            },
            include: { category: true },
        });

        return NextResponse.json(income, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An error occurred while creating the income." },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id, ...data } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "Income ID is required" }, { status: 400 });
        }
        const updatedIncome = await prisma.income.update({
            where: { id },
            data: {
                ...data,
                amount: parseFloat(data.amount),
                date: new Date(data.date),
            },
            include: { category: true },
        });
        return NextResponse.json(updatedIncome);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update income" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "Income ID is required" }, { status: 400 });
        }
        await prisma.income.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Income deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete income" }, { status: 500 });
    }
} 