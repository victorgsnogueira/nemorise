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
import { FormattedCurrencyInput } from '@/components/ui/formatted-currency-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IncomeFormProps {
  income?: IncomeWithRelations;
  onSuccess: () => void;
}

export function IncomeForm({ income, onSuccess }: IncomeFormProps) {
  const { state, addIncome, updateIncome } = useFinance();
  
  const [description, setDescription] = useState(income?.description ?? '');
  const [amount, setAmount] = useState<number | string>(income?.amount ?? '');
  const [date, setDate] = useState<Date | undefined>(income?.date ? new Date(income.date) : new Date());
  const [categoryId, setCategoryId] = useState(income?.categoryId ?? '');
  const [notes, setNotes] = useState(income?.notes ?? '');
  const [isReceived, setIsReceived] = useState(income?.isReceived ?? false);
  const [error, setError] = useState<string | null>(null);

  const incomeCategories = state.categories.filter(cat => cat.type === 'INCOME');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    
    if (!description || !amount || !date || !categoryId) {
        setError('Preencha todos os campos obrigatórios.');
        return;
    }

    const numericAmount = parseFloat(String(amount));

    const data = {
      description,
      amount: isNaN(numericAmount) ? 0 : numericAmount,
      date,
      categoryId,
      notes,
      isReceived,
    };

    try {
      if (income) {
        await updateIncome({ ...income, ...data });
        toast.success(`Receita atualizada com sucesso!`);
      } else {
        await addIncome(data);
        toast.success(`Receita adicionada com sucesso!`);
      }
      onSuccess();
    } catch (err) {
      setError('Falha ao salvar receita. Tente novamente.');
      console.error(err);
      toast.error('Falha ao salvar receita.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
      <div className='overflow-y-auto pr-6 -mr-6 min-h-[350px]'>
        <div className="space-y-3">
          <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Salário" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <FormattedCurrencyInput
                id="amount"
                placeholder="R$ 0,00"
                onValueChange={(value) => setAmount(value ? parseFloat(value) : '')}
                value={amount}
                prefix="R$ "
                decimalSeparator=","
                groupSeparator="."
              />
            </div>
            <div className="space-y-2">
              <Label>Data da Receita</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select onValueChange={setCategoryId} defaultValue={categoryId} required>
                <SelectTrigger className="w-full">
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
            <div className="hidden md:block" />
          </div>

          <div className="flex items-center gap-2 mt-4 min-h-[20px]">
            <Switch id="isReceived" checked={isReceived} onCheckedChange={setIsReceived} />
            <Label htmlFor="isReceived">Recebido</Label>
          </div>

          <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações adicionais..." />
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      <div className="pt-4 flex justify-end">
        <Button type="submit">
          {income ? 'Salvar Alterações' : 'Adicionar Receita'}
        </Button>
      </div>
    </form>
  );
} 