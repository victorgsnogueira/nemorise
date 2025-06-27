'use client';

import { Button } from '@/components/ui/button';
import { useFinance } from '@/contexts/finance-context';
import { format, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function MonthSelector() {
  const { state, dispatch } = useFinance();
  const { selectedMonth } = state;

  const handlePrevMonth = () => {
    dispatch({ type: 'SET_MONTH', payload: subMonths(selectedMonth, 1) });
  };

  const handleNextMonth = () => {
    dispatch({ type: 'SET_MONTH', payload: addMonths(selectedMonth, 1) });
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-semibold w-40 text-center">
        {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
} 