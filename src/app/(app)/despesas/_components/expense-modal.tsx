'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ExpenseForm } from './expense-form';
import { ExpenseWithRelations } from '@/contexts/finance-context';

interface ExpenseModalProps {
  expense?: ExpenseWithRelations;
  trigger?: React.ReactNode;
}

export function ExpenseModal({ expense, trigger }: ExpenseModalProps) {
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
            Nova Despesa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-md max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? 'Editar Despesa' : 'Nova Despesa'}</DialogTitle>
          <DialogDescription>
            {expense
              ? 'Atualize os detalhes da sua despesa.'
              : 'Preencha os detalhes da nova despesa.'}
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm expense={expense} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
} 