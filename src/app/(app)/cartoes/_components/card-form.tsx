"use client";

import { useState } from 'react';
import ky from 'ky';
import { useFinance } from '@/contexts/finance-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Card } from '@prisma/client';

interface CardFormProps {
  card?: Card;
  trigger?: React.ReactNode;
}

export function CardForm({ card, trigger }: CardFormProps) {
  const { dispatch } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      let savedCard: Card;
      if (card) {
        // Update card
        savedCard = await ky.put('/api/cards', { json: { ...data, id: card.id } }).json();
        dispatch({ type: 'UPDATE_CARD', payload: savedCard });
      } else {
        // Create card
        savedCard = await ky.post('/api/cards', { json: data }).json();
        dispatch({ type: 'ADD_CARD', payload: savedCard });
      }
      setIsOpen(false);
    } catch (err) {
      setError('Failed to save card. Please try again.');
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cartão
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{card ? 'Editar Cartão' : 'Novo Cartão'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input id="name" name="name" defaultValue={card?.name} required />
          </div>
          <div>
            <Label htmlFor="dueDay">Dia do Vencimento</Label>
            <Input id="dueDay" name="dueDay" type="number" defaultValue={card?.dueDay} required />
          </div>
          <div>
            <Label htmlFor="color">Cor</Label>
            <Input id="color" name="color" type="color" defaultValue={card?.color ?? '#000000'} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 