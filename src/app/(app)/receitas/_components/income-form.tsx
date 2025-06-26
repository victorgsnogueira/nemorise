"use client";

import { useState } from 'react';
import { useFinance, IncomeWithRelations } from '@/contexts/finance-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface IncomeFormProps {
  income?: IncomeWithRelations;
  onSuccess: () => void;
}

export function IncomeForm({ income, onSuccess }: IncomeFormProps) {
  const { state, addIncome, updateIncome } = useFinance();
  const [error, setError] = useState<string | null>(null);

  const incomeCategories = state.categories.filter(cat => cat.type === 'INCOME');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const data = {
        description: formData.get('description') as string,
        amount: parseFloat(formData.get('amount') as string),
        date: new Date(formData.get('date') as string),
        categoryId: formData.get('categoryId') as string,
        notes: formData.get('notes') as string || null,
        isReceived: formData.get('isReceived') === 'on',
    };

    try {
      if (income) {
        await updateIncome({ ...income, ...data });
      } else {
        await addIncome(data);
      }
      toast.success(`Receita ${income ? 'atualizada' : 'adicionada'} com sucesso!`);
      onSuccess();
    } catch (err) {
      setError('Falha ao salvar receita. Tente novamente.');
      console.error(err);
      toast.error('Falha ao salvar receita.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" defaultValue={income?.description} required />
        </div>
        <div>
            <Label htmlFor="amount">Valor</Label>
            <Input id="amount" name="amount" type="number" step="0.01" defaultValue={income?.amount} required />
        </div>
        <div>
            <Label htmlFor="date">Data</Label>
            <Input id="date" name="date" type="date" defaultValue={income?.date ? new Date(income.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} required />
        </div>
        <div>
            <Label htmlFor="categoryId">Categoria</Label>
            <Select name="categoryId" defaultValue={income?.categoryId} required>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                    {incomeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center space-x-2">
            <Switch id="isReceived" name="isReceived" defaultChecked={income?.isReceived} />
            <Label htmlFor="isReceived">Recebido?</Label>
        </div>
        <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" name="notes" defaultValue={income?.notes ?? ''} />
        </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full">
        {income ? 'Salvar Alterações' : 'Adicionar Receita'}
      </Button>
    </form>
  );
} 