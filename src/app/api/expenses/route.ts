import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addMonths } from "date-fns";
import cuid from "cuid";

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
    } catch {
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

        if (isInstallment && installments > 1) {
            const installmentGroupId = cuid();
            const expenseDate = new Date(date);
            const totalInstallments = parseInt(installments, 10);

            const expenseCreates = Array.from({ length: totalInstallments }).map((_, i) => {
                return prisma.expense.create({
                    data: {
                        description,
                        amount: parseFloat(amount),
                        date: addMonths(expenseDate, i),
                        isPaid: i === 0 ? Boolean(isPaid) : false,
                        notes,
                        isInstallment: true,
                        installments: totalInstallments,
                        installmentNumber: i + 1,
                        totalInstallments,
                        installmentGroupId,
                        userId: session.user!.id,
                        categoryId,
                        cardId,
                    },
                });
            });

            await prisma.$transaction(expenseCreates);

            const newExpenses = await prisma.expense.findMany({
                where: { installmentGroupId },
                include: { category: true, card: true },
                orderBy: { date: 'asc' },
            });

            return NextResponse.json(newExpenses, { status: 201 });

        } else {
            const expense = await prisma.expense.create({
                data: {
                    description,
                    amount: parseFloat(amount),
                    date: new Date(date),
                    isPaid: Boolean(isPaid),
                    notes,
                    isInstallment: false,
                    installments: 1,
                    userId: session.user.id,
                    categoryId,
                    cardId,
                },
                include: {
                    category: true,
                    card: true,
                }
            });
            return NextResponse.json([expense], { status: 201 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An error occurred while creating the expense." },
            { status: 500 }
        );
    }
}

interface UpdateExpenseData {
    description?: string;
    amount?: number;
    date?: Date;
    isPaid?: boolean;
    notes?: string;
    isInstallment?: boolean;
    installments?: number;
    categoryId?: string;
    cardId?: string | null;
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, description, amount, date, isPaid, notes, isInstallment, installments, categoryId, cardId } = body;
        
        if (!id) {
            return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
        }

        const dataToUpdate: UpdateExpenseData = {};
        if (description !== undefined) dataToUpdate.description = description;
        if (amount !== undefined) dataToUpdate.amount = parseFloat(amount);
        if (date !== undefined) dataToUpdate.date = new Date(date);
        if (isPaid !== undefined) dataToUpdate.isPaid = Boolean(isPaid);
        if (notes !== undefined) dataToUpdate.notes = notes;
        if (isInstallment !== undefined) dataToUpdate.isInstallment = Boolean(isInstallment);
        if (installments !== undefined) dataToUpdate.installments = parseInt(installments, 10);
        if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
        if (cardId !== undefined) dataToUpdate.cardId = cardId;

        const updatedExpense = await prisma.expense.update({
            where: { id: id },
            data: dataToUpdate,
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