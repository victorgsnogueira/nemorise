"use client";

import { useFinance } from "@/contexts/finance-context";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarFooterNav() {
    const { state, getDashboardStats } = useFinance();
    const stats = getDashboardStats();

    return (
        <>
            <div className="flex flex-col gap-2 p-2 rounded-lg bg-background">
                <span className="text-xs text-muted-foreground">Saldo Total</span>
                {state.isLoaded ? (
                    <span className="text-lg font-bold">{formatCurrency(stats.balance)}</span>
                ) : (
                    <Skeleton className="h-6 w-3/4" />
                )}
            </div>
            </>
    );
} 