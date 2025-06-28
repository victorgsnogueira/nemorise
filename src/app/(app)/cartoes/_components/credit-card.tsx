'use client';

import { Button } from '@/components/ui/button';
import { CardForm } from './card-form';
import { CreditCard as CreditCardIcon, Edit, Trash2 } from 'lucide-react';
import type { Card } from '@prisma/client';
import ky from 'ky';
import { useFinance } from '@/contexts/finance-context';

interface CreditCardComponentProps {
  card: Card;
}

export function CreditCardComponent({ card }: CreditCardComponentProps) {
  const { dispatch } = useFinance();

  const handleDelete = async (id: string) => {
    try {
      await ky.delete('/api/cards', { json: { id } });
      dispatch({ type: 'DELETE_CARD', payload: id });
    } catch (error) {
      console.error('Failed to delete card', error);
    }
  };

  return (
    <div
      className="relative flex h-48 flex-col justify-between rounded-xl p-6 text-white shadow-md"
      style={{ backgroundColor: card.color ?? '#333' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">{card.name}</span>
        </div>
        <CreditCardIcon className="h-10 w-10 opacity-20" />
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-sm">Vencimento</span>
          <span className="text-base font-semibold">Dia {card.dueDay}</span>
        </div>
        <div className="flex items-center gap-2">
          <CardForm
            card={card}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => handleDelete(card.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 