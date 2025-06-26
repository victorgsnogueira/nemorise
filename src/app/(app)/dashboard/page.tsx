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

export default function DashboardPage() {
  const { state, getDashboardStats } = useFinance();
  const stats = getDashboardStats();

  const recentExpenses = [...state.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentIncomes = [...state.incomes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const pendingExpenses = state.expenses.filter((exp) => !exp.isPaid);
  const pendingIncome = state.incomes.filter((inc) => !inc.isReceived);

  if (!state.isLoaded) {
    return (
      <div className="flex flex-col gap-4">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
              Receitas - Despesas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
                        <p className="text-xs text-muted-foreground">
              {pendingIncome.length} pendentes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
                        <p className="text-xs text-muted-foreground">
              {pendingExpenses.length} pendentes
                        </p>
                    </CardContent>
                </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Expenses */}
                <Card>
          <CardHeader>
            <CardTitle>Despesas Recentes</CardTitle>
            <CardDescription>
              Últimas 5 despesas registradas
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
                  <div key={expense.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm font-medium">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {expense.category.name} • {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        -{formatCurrency(expense.amount)}
                      </p>
                      <Badge variant={expense.isPaid ? 'default' : 'secondary'}>
                        {expense.isPaid ? 'Pago' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
                    </CardContent>
                </Card>

        {/* Recent Incomes */}
        <Card>
                    <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
            <CardDescription>
              Últimas 5 receitas registradas
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
                  <div key={income.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium">{income.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {income.category.name} • {new Date(income.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(income.amount)}
                      </p>
                      <Badge variant={income.isReceived ? 'default' : 'secondary'}>
                        {income.isReceived ? 'Recebido' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 