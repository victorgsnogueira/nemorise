'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Category } from '@prisma/client';
import { CategoryForm } from './category-form';
import { Edit } from 'lucide-react';

interface CategoryModalProps {
  category?: Category;
}

export function CategoryModal({ category }: CategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const button = category ? (
    <Button variant="ghost" size="icon">
      <Edit className="h-4 w-4" />
      <span className="sr-only">Editar Categoria</span>
    </Button>
  ) : (
    <Button>Nova Categoria</Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {button}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>
            {category ? 'Atualize os dados da sua categoria.' : 'Crie uma nova categoria para suas transações.'}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
} 