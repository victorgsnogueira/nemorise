"use client";

import ky from "ky";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface NewCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewCategoryModal({ isOpen, onClose }: NewCategoryModalProps) {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        
        // TODO: Get userId from session
        const userId = "clxya1hch000014toq98m5syr";

        try {
            await ky.post("/api/categories", {
                json: { ...data, userId },
            });
            onClose(); 
            // TODO: Add success notification and refetch categories
        } catch (error) {
            console.error("Failed to create category", error);
            // TODO: Add error notification
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Categoria</DialogTitle>
                    <DialogDescription>
                        Crie uma nova categoria para suas transações.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" name="name" required />
                    </div>
                    <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select name="type" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EXPENSE">Despesa</SelectItem>
                                <SelectItem value="INCOME">Receita</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="color">Cor</Label>
                        <Input id="color" name="color" type="color" required />
                    </div>
                    <Button type="submit">Salvar</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
} 