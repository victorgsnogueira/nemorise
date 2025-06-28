'use client';

import { useFinance } from '@/contexts/finance-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageLayout } from '../_components/page-layout';
import { Edit, Trash2 } from 'lucide-react';
import { CardForm } from './_components/card-form';
import { Skeleton } from '@/components/ui/skeleton';
import ky from 'ky';
import { CreditCardComponent } from './_components/credit-card';

function CardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full rounded-lg" />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function CardsPage() {
  const { state } = useFinance();

  if (!state.isLoaded) {
    return (
       <PageLayout>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <CardSkeleton />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Meus Cartões
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus cartões de crédito.
          </p>
        </div>
        <CardForm />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {state.cards.map((card) => (
          <CreditCardComponent key={card.id} card={card} />
        ))}
      </div>
    </PageLayout>
  );
} 