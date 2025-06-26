"use client";

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
import { 
    LayoutGrid,
    ArrowLeftRight,
    TrendingUp,
    Shapes,
    Settings,
    CreditCard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav() {
    const pathname = usePathname();

    const menuItems = [
        {
            group: "Análise",
            items: [
                { href: "/dashboard", label: "Visão Geral", icon: LayoutGrid },
                { href: "/despesas", label: "Despesas", icon: ArrowLeftRight },
                { href: "/receitas", label: "Receitas", icon: TrendingUp },
                { href: "/investimentos", label: "Investimentos", icon: Shapes },
            ],
        },
        {
            group: "Gerenciar",
            items: [
                { href: "/categorias", label: "Categorias", icon: Settings },
                { href: "/cartoes", label: "Cartões", icon: CreditCard },
            ],
        },
    ];

    return (
        <SidebarMenu>
            {menuItems.map((group, index) => (
                <SidebarGroup key={index} className="space-y-1">
                    <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                    {group.items.map((item, itemIndex) => {
                        const Icon = item.icon;
                        return (
                            <SidebarMenuItem  key={itemIndex}>
                                <Link href={item.href}>
                                    <SidebarMenuButton isActive={pathname === item.href} >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarGroup>
            ))}
        </SidebarMenu>
    );
} 