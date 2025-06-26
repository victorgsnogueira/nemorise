"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "./_components/categories-table";
import { NewCategoryModal } from "./_components/new-category-modal";

export default function CategoriasPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <NewCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Categorias</h1>
                <Button onClick={() => setIsModalOpen(true)}>Nova Categoria</Button>
            </div>
            <CategoriesTable />
        </div>
    );
} 