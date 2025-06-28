'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Investment, InvestmentStatus } from '@prisma/client';
import { useFinance } from '@/contexts/finance-context';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FormattedCurrencyInput } from '@/components/ui/formatted-currency-input';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  description: z.string().min(3, { message: 'A descrição deve ter pelo menos 3 caracteres.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  date: z.date({ required_error: 'A data é obrigatória.' }),
  isPromise: z.boolean(),
});

interface InvestmentModalProps {
  investment?: Investment;
  trigger?: React.ReactNode;
}

export function InvestmentModal({ investment, trigger }: InvestmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, addInvestment, updateInvestment, getDashboardStats } = useFinance();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: investment?.description || '',
      amount: investment?.amount || undefined,
      date: investment ? new Date(investment.date) : new Date(),
      isPromise: investment?.status === InvestmentStatus.RESERVED || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const status = values.isPromise ? InvestmentStatus.RESERVED : InvestmentStatus.COMPLETED;
    
    // Balance Check
    if (status === InvestmentStatus.COMPLETED) {
      const { balance } = getDashboardStats();
      const totalCompletedInvestments = state.investments
        .filter(inv => inv.status === 'COMPLETED' && inv.id !== investment?.id)
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      const availableCash = balance - totalCompletedInvestments;

      if (values.amount > availableCash) {
        form.setError('amount', {
          message: `Valor excede o saldo disponível de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableCash)}.`,
        });
        return;
      }
    }
    
    try {
      const dataToSave = { ...values, status };
      if (investment) {
        await updateInvestment({ ...investment, ...dataToSave });
      } else {
        await addInvestment(dataToSave);
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save investment:', error);
      // Aqui você pode adicionar um toast de erro para o usuário
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Investimento
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{investment ? 'Editar Investimento' : 'Adicionar Investimento'}</DialogTitle>
          <DialogDescription>
            {investment ? 'Atualize os detalhes do seu investimento.' : 'Registre um novo investimento ou valor reservado.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ações da Apple, Reserva de emergência..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <FormattedCurrencyInput
                        id="amount"
                        placeholder="R$ 0,00"
                        onValueChange={(value) => field.onChange(value ? parseFloat(value) : undefined)}
                        value={field.value}
                        prefix="R$ "
                        decimalSeparator=","
                        groupSeparator="."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                    <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="isPromise"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Reservar Valor
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancelar
                    </Button>
                </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 