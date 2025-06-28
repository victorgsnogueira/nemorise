"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { ExpenseForm } from '@/app/(app)/despesas/_components/expense-form';
import { IncomeForm } from '@/app/(app)/receitas/_components/income-form';

interface AddTransactionDialogProps {
    trigger?: React.ReactNode;
}

export function AddTransactionDialog({ trigger }: AddTransactionDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Transação
                </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[95vh] overflow-y-auto">
                <Tabs defaultValue="income" className="w-full">
                    <TabsList>
                        <TabsTrigger value="income">Receita</TabsTrigger>
                        <TabsTrigger value="expense">Despesa</TabsTrigger>
                    </TabsList>
                    <TabsContent value="income">
                        <DialogHeader className="pt-6 pb-4">
                            <DialogTitle>Adicionar Receita</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes da nova receita.
                            </DialogDescription>
                        </DialogHeader>
                        <IncomeForm onSuccess={handleSuccess} />
                    </TabsContent>
                    <TabsContent value="expense">
                        <DialogHeader className="pt-6 pb-4">
                            <DialogTitle>Adicionar Despesa</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes da nova despesa.
                            </DialogDescription>
                        </DialogHeader>
                        <ExpenseForm onSuccess={handleSuccess} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
} 