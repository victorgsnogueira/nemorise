"use client";

import { useState } from "react";
import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageLayout } from "../_components/page-layout";
import { TableSkeleton } from "../_components/table-skeleton";
import { Search } from "lucide-react";
import { Category } from "@prisma/client";
import ky from "ky";
import { toast } from "sonner";
import { CategoryModal } from "./_components/category-modal";
import { CategoriesTable } from "./_components/categories-table";

export default function CategoriesPage() {
    const { state, dispatch } = useFinance();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const filteredCategories = state.categories?.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !typeFilter || typeFilter === 'all' || category.type === typeFilter;
        return matchesSearch && matchesType;
    }).sort((a, b) => a.name.localeCompare(b.name)) || [];

    const totalCategories = filteredCategories.length;
    const incomeCategories = filteredCategories.filter(cat => cat.type === 'INCOME').length;
    const expenseCategories = filteredCategories.filter(cat => cat.type === 'EXPENSE').length;

    const handleDelete = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await ky.delete('/api/categories', { json: { id: categoryToDelete.id } });
                dispatch({ type: 'DELETE_CATEGORY', payload: categoryToDelete.id });
                toast.success('Categoria excluída com sucesso!');
            } catch (error) {
                console.error('Failed to delete category', error);
                toast.error('Ocorreu um erro ao excluir a categoria.');
            } finally {
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
            }
        }
    };

    if (!state.isLoaded) {
        return (
            <PageLayout>
                <TableSkeleton 
                    title="Categorias"
                    description="Gerencie as categorias para suas receitas e despesas."
                    columns={['Nome', 'Tipo', 'Cor', 'Ações']}
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                    <p className="text-muted-foreground">
                        Gerencie as categorias para suas receitas e despesas.
                    </p>
                </div>
                <CategoryModal />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalCategories}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categorias de Receita</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {incomeCategories}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categorias de Despesa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {expenseCategories}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>
                        Filtre suas categorias para encontrar o que procura.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Buscar</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nome..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo</label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os tipos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os tipos</SelectItem>
                                    <SelectItem value="INCOME">Receita</SelectItem>
                                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categories Table */}
            <CategoriesTable 
                categories={filteredCategories} 
                onDelete={handleDelete}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir a categoria &quot;{categoryToDelete?.name}&quot;? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
} 