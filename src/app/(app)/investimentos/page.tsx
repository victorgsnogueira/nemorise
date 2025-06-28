'use client';

import { useFinance } from '@/contexts/finance-context';
import { PageLayout } from '../_components/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CheckCircle2, PlusCircle } from 'lucide-react';
import { InvestmentModal } from './_components/investment-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { InvestmentsSkeleton } from './_components/investments-skeleton';

export default function InvestmentsPage() {
  const { state, deleteInvestment } = useFinance();
  const { investments, isLoaded } = state;

  const totalInvested = investments
    .filter(inv => inv.status === 'COMPLETED')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const totalReserved = investments
    .filter(inv => inv.status === 'RESERVED')
    .reduce((sum, inv) => sum + inv.amount, 0);

  if (!isLoaded) {
    return <InvestmentsSkeleton />;
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
          <p className="text-muted-foreground">
            Acompanhe seus investimentos e valores reservados.
          </p>
        </div>
        <InvestmentModal />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Investido</CardTitle>
            <CardDescription>
              {investments.filter(inv => inv.status === 'COMPLETED').length} investimentos concluídos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(totalInvested)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Reservado</CardTitle>
            <CardDescription>
              {investments.filter(inv => inv.status === 'RESERVED').length} promessas de economia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {formatCurrency(totalReserved)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Investments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <PlusCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                Nenhum investimento encontrado
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Comece adicionando seu primeiro investimento.
              </p>
              <div className="mt-6">
                <InvestmentModal 
                  trigger={
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar Investimento
                    </Button>
                  }
                />
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(investment.amount)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(investment.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={investment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {investment.status === 'COMPLETED' ? 'Concluído' : 'Reservado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        {investment.status === 'RESERVED' && (
                          <InvestmentModal 
                            investment={investment}
                            trigger={
                              <Button variant="ghost" size="icon">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="sr-only">Concluir</span>
                              </Button>
                            }
                          />
                        )}
                        <InvestmentModal 
                          investment={investment}
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          }
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o investimento &quot;{investment.description}&quot;? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteInvestment(investment.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
} 