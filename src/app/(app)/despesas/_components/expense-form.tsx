"use client";

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFinance, ExpenseWithRelations } from '@/contexts/finance-context';
import { toast } from 'sonner';
import { FormattedCurrencyInput } from '@/components/ui/formatted-currency-input';
import { Checkbox } from '@/components/ui/checkbox';

interface ExpenseFormProps {
  expense?: ExpenseWithRelations;
  onSuccess: () => void;
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const { state, addExpense, updateExpense } = useFinance();

  const [description, setDescription] = useState(expense?.description ?? '');
  const [amount, setAmount] = useState<number | undefined>(expense?.amount);
  const [date, setDate] = useState<Date | undefined>(expense?.date ? new Date(expense.date) : new Date());
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? '');
  const [cardId, setCardId] = useState(expense?.cardId ?? null);
  const [isPaid, setIsPaid] = useState(expense?.isPaid ?? false);
  const [isInstallment, setIsInstallment] = useState(expense?.isInstallment ?? false);
  const [installments, setInstallments] = useState(expense?.installments ?? 1);
  const [notes, setNotes] = useState(expense?.notes ?? '');
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description || !amount || !date || !categoryId) {
        setError('Preencha todos os campos obrigatórios.');
        return;
    }

    const dataToSave = {
      description,
      amount,
      date,
      categoryId,
      cardId: cardId === 'none' ? null : cardId,
      isPaid,
      isInstallment,
      installments: isInstallment ? installments : 1,
      notes,
    };

    try {
      if (expense) {
        await updateExpense({ ...expense, ...dataToSave });
        toast.success('Despesa atualizada com sucesso!');
      } else {
        await addExpense(dataToSave);
        toast.success('Despesa adicionada com sucesso!');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro ao salvar a despesa.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Almoço no restaurante" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor</Label>
          <FormattedCurrencyInput
            id="amount"
            placeholder="R$ 0,00"
            onValueChange={(value) => setAmount(value ? parseFloat(value) : undefined)}
            value={amount}
            prefix="R$ "
            decimalSeparator=","
            groupSeparator="."
          />
        </div>
        <div className="space-y-2">
            <Label>Data da Despesa</Label>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select onValueChange={setCategoryId} defaultValue={categoryId}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                {state.categories.filter(c => c.type === 'EXPENSE').map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="cardId">Cartão (Opcional)</Label>
            <Select onValueChange={setCardId} defaultValue={cardId ?? 'none'}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cartão" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {state.cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>{card.name}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-2">
            <Checkbox
                id="isInstallment"
                checked={isInstallment}
                onCheckedChange={(checked) => setIsInstallment(Boolean(checked))}
            />
          <Label htmlFor="isInstallment">É uma compra parcelada?</Label>
        </div>

        {isInstallment && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="installments">Número de Parcelas</Label>
            <Input
              id="installments"
              type="number"
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
              className="max-w-xs"
              min={2}
            />
          </div>
        )}
      
        <div className="flex items-center gap-2">
            <Checkbox id="isPaid" checked={isPaid} onCheckedChange={(checked) => setIsPaid(Boolean(checked))} />
          <Label htmlFor="isPaid" className="text-sm">Já foi pago?</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações adicionais sobre a despesa..."
          rows={3}
        />
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="pt-4 flex justify-end">
        <Button type="submit">
          {expense ? 'Salvar Alterações' : 'Adicionar Despesa'}
        </Button>
      </div>
    </form>
  );
} 