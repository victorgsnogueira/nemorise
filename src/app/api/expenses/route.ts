import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            include: {
                category: true,
                card: true,
            },
            orderBy: {
                date: "desc",
            },
        });
        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while fetching expenses." },
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
        const {
            description,
            amount,
            date,
            isPaid,
            notes,
            isInstallment,
            installments,
            categoryId,
            cardId,
        } = body;

        // Basic validation
        if (!description || !amount || !date || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const expense = await prisma.expense.create({
            data: {
                description,
                amount: parseFloat(amount),
                date: new Date(date),
                isPaid: Boolean(isPaid),
                notes,
                isInstallment: Boolean(isInstallment),
                installments: parseInt(installments, 10),
                userId: session.user.id,
                categoryId,
                cardId,
            },
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An error occurred while creating the expense." },
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
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) {
            return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
        }

        const updatedExpense = await prisma.expense.update({
            where: { id: id },
            data: {
                ...data,
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                installments: parseInt(data.installments, 10),
            },
            include: { category: true, card: true },
        });
        return NextResponse.json(updatedExpense);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
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
            return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
        }

        await prisma.expense.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
    }
} 