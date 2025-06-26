"use client";

import { useState, useEffect } from "react";
import ky from "ky";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Expense, Category, Card } from "@prisma/client";

type ExpenseWithRelations = Expense & {
    category: Category;
    card: Card | null;
};

export function ExpensesTable() {
    const [expenses, setExpenses] = useState<ExpenseWithRelations[]>([]);

    useEffect(() => {
        async function fetchExpenses() {
            try {
                const data = await ky.get("/api/expenses").json<ExpenseWithRelations[]>();
                setExpenses(data);
            } catch (error) {
                console.error("Failed to fetch expenses", error);
            }
        }
        fetchExpenses();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Cartão</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>{formatDate(expense.date.toString())}</TableCell>
                        <TableCell>
                            <Badge style={{ backgroundColor: expense.category.color }}>
                                {expense.category.name}
                            </Badge>
                        </TableCell>
                        <TableCell>{expense.card?.name || "N/A"}</TableCell>
                        <TableCell>
                            <Badge variant={expense.isPaid ? "default" : "outline"}>
                                {expense.isPaid ? "Pago" : "Pendente"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
} 