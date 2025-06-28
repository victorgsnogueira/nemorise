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
import { IncomeForm } from './income-form';
import { IncomeWithRelations } from '@/contexts/finance-context';

interface IncomeModalProps {
  income?: IncomeWithRelations;
  trigger?: React.ReactNode;
}

export function IncomeModal({ income, trigger }: IncomeModalProps) {
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
            Nova Receita
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{income ? 'Editar Receita' : 'Nova Receita'}</DialogTitle>
          <DialogDescription>
            {income
              ? 'Atualize os detalhes da sua receita.'
              : 'Preencha os detalhes da nova receita.'}
          </DialogDescription>
        </DialogHeader>
        <IncomeForm income={income} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
} 