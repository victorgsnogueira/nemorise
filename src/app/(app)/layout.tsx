import { Header } from "@/components/header";
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./_components/sidebar-nav";
import { SidebarFooterNav } from "./_components/sidebar-footer-nav";
import { FinanceProvider } from "@/contexts/finance-context";
import { ThemeLoader } from "@/components/theme-loader";
import { Toaster } from "@/components/ui/sonner";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <FinanceProvider>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="p-4 border-b h-16 flex items-center">
                        <Button variant="ghost" className="w-full justify-start gap-2 p-1 h-auto text-lg font-semibold" asChild>
                            <Link href="/dashboard">
                                <span className="text-green-500 group-[[data-state=expanded]]:hidden">
                                    $
                                </span>
                                <span className="group-[[data-state=collapsed]]:hidden">
                                    Nemori<span className="text-green-500">$</span>e
                                </span>
                            </Link>
                        </Button>
                    </SidebarHeader>
                    <SidebarContent className="p-4">
                        <SidebarNav />
                    </SidebarContent>
                    <SidebarFooter className="p-4">
                        <SidebarFooterNav />
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1">
                    <Header session={session} />
                    <div className="p-4">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
            <ThemeLoader />
            <Toaster />
        </FinanceProvider>
    );
} 