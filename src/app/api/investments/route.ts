import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const investments = await prisma.investment.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(investments);
    } catch (error) {
        console.error("Failed to fetch investments:", error);
        return NextResponse.json({ error: "Failed to fetch investments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            description,
            amount,
            date,
            status,
        } = body;

        if (!description || !amount || !date || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const investment = await prisma.investment.create({
            data: {
                description,
                amount: parseFloat(amount),
                date: new Date(date),
                status,
                userId: session.user.id,
            },
        });

        return NextResponse.json(investment, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An error occurred while creating the investment." },
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
        const { id, description, amount, date, status } = await req.json();
        
        if (!id) {
            return NextResponse.json({ error: "Investment ID is required" }, { status: 400 });
        }

        const updatedInvestment = await prisma.investment.update({
            where: { id },
            data: {
                description,
                amount: parseFloat(amount),
                date: new Date(date),
                status,
            },
        });
        return NextResponse.json(updatedInvestment);
    } catch (error) {
        console.error("Failed to update investment:", error);
        return NextResponse.json({ error: "Failed to update investment" }, { status: 500 });
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
            return NextResponse.json({ error: "Investment ID is required" }, { status: 400 });
        }
        await prisma.investment.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Investment deleted" });
    } catch {
        return NextResponse.json({ error: "Failed to delete investment" }, { status: 500 });
    }
} 