'use client';

import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/finance-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IncomeModal } from './_components/income-modal';
import { PageLayout } from '../_components/page-layout';
import { TableSkeleton } from '../_components/table-skeleton';
import { formatCurrency } from '@/lib/utils';
import { Edit, Trash2, Search } from 'lucide-react';
import { IncomeWithRelations } from '@/contexts/finance-context';
import ky from 'ky';

export default function IncomePage() {
  const { state, dispatch } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<IncomeWithRelations | null>(null);

  const incomeCategories = state.categories?.filter((cat) => cat.type === 'INCOME') || [];

  const filteredIncome = state.incomes?.filter((income) => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (income.category?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || income.categoryId === categoryFilter;
    const matchesStatus = !statusFilter || statusFilter === 'all' ||
      (statusFilter === 'received' && income.isReceived) ||
      (statusFilter === 'pending' && !income.isReceived);

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  const totalIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const receivedIncome = filteredIncome.filter((inc) => inc.isReceived).reduce((sum, inc) => sum + inc.amount, 0);
  const pendingIncome = filteredIncome.filter((inc) => !inc.isReceived).reduce((sum, inc) => sum + inc.amount, 0);

  const handleDelete = (income: IncomeWithRelations) => {
    setIncomeToDelete(income);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (incomeToDelete) {
        try {
            await ky.delete('/api/incomes', { json: { id: incomeToDelete.id } });
            dispatch({ type: 'DELETE_INCOME', payload: incomeToDelete.id });
        } catch (error) {
            console.error('Failed to delete income', error);
        } finally {
            setDeleteDialogOpen(false);
            setIncomeToDelete(null);
        }
    }
  };

  if (!state.isLoaded) {
    return (
      <PageLayout>
        <TableSkeleton 
          title="Receitas"
          description="Gerencie suas receitas e controle seus ganhos"
          columns={['Descrição', 'Categoria', 'Valor', 'Data', 'Status', 'Ações']}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e controle seus ganhos
          </p>
        </div>
        <IncomeModal />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredIncome.length} receitas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Recebidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(receivedIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredIncome.filter(inc => inc.isReceived).length} recebidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(pendingIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredIncome.filter(inc => !inc.isReceived).length} pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre suas receitas para encontrar o que procura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {incomeCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="received">Recebidas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredIncome.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma receita encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncome.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell className="font-medium">{income.description}</TableCell>
                      <TableCell>{income.category?.name || 'N/A'}</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        +{formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={income.isReceived ? 'default' : 'secondary'}>
                          {income.isReceived ? 'Recebido' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <IncomeModal 
                            income={income}
                            trigger={
                              <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Button>
                            }
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(income)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a receita "{incomeToDelete?.description}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
} 