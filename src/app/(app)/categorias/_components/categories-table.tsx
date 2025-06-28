"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CategoryModal } from "./category-modal";

interface CategoriesTableProps {
    categories: Category[];
    onDelete: (category: Category) => void;
}

export function CategoriesTable({ categories, onDelete }: CategoriesTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lista de Categorias</CardTitle>
            </CardHeader>
            <CardContent>
                {categories.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Cor</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={category.type === 'INCOME' ? 'default' : 'secondary'}>
                                            {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            {category.color}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <CategoryModal category={category} />
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(category)}>
                                                <Trash2 className="h-4 w-4" />
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
    );
} 