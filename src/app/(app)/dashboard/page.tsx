"use client";

import { useFinance } from '@/contexts/finance-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { AddTransactionDialog } from './_components/add-transaction-dialog';
import { DashboardSkeleton } from './_components/dashboard-skeleton';
import { ExpenseWithRelations, IncomeWithRelations } from '@/contexts/finance-context';
import { PageLayout } from '../_components/page-layout';

export default function DashboardPage() {
  const { state, getDashboardStats } = useFinance();
  const stats = getDashboardStats();

  const recentExpenses = state.expenses;
  const recentIncomes = state.incomes;

  if (!state.isLoaded) {
    return <DashboardSkeleton />;
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.balance)}
            </div>
                        <p className="text-xs text-muted-foreground">
                    Saldo atual em todas as contas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas (mês)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
                        <p className="text-xs text-muted-foreground">
                    {stats.pendingIncome} receitas pendentes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas (mês)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
                        <p className="text-xs text-muted-foreground">
                    {stats.pendingExpenses} despesas pendentes
                        </p>
                    </CardContent>
                </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Incomes */}
        <Card>
                    <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
            <CardDescription>
                    Últimas 5 receitas registradas no sistema.
            </CardDescription>
                    </CardHeader>
                    <CardContent>
            <div className="space-y-4">
              {recentIncomes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma receita registrada
                </p>
              ) : (
                recentIncomes.map((income: IncomeWithRelations) => (
                        <div key={income.id} className="flex items-center">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{income.description}</p>
                                <p className="text-sm text-muted-foreground">
                          {income.category.name} • {new Date(income.date).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                    <div className="text-right">
                                <p className="font-semibold text-green-600">
                        {formatCurrency(income.amount)}
                      </p>
                                <Badge className="mt-1" variant={income.isReceived ? 'default' : 'secondary'}>
                        {income.isReceived ? 'Recebido' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
                    </CardContent>
                </Card>
        {/* Recent Expenses */}
        <Card>
            <CardHeader>
                <CardTitle>Despesas Recentes</CardTitle>
                <CardDescription>
                    Últimas 5 despesas registradas no sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentExpenses.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Nenhuma despesa registrada
                        </p>
                    ) : (
                        recentExpenses.map((expense: ExpenseWithRelations) => (
                            <div key={expense.id} className="flex items-center">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">{expense.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {expense.category.name} • {new Date(expense.date).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-red-600">
                                        -{formatCurrency(expense.amount)}
                                    </p>
                                    <Badge className="mt-1" variant={expense.isPaid ? 'default' : 'secondary'}>
                                        {expense.isPaid ? 'Pago' : 'Pendente'}
                                    </Badge>
            </div>
        </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  </PageLayout>
    );
} 