"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import ky from "ky"
import { toast } from "sonner"

const themeProperties = [
    "--background", "--foreground", "--card", "--card-foreground",
    "--popover", "--popover-foreground", "--primary", "--primary-foreground",
    "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
    "--accent", "--accent-foreground", "--border", "--input", "--ring",
    "--sidebar", "--sidebar-foreground", "--sidebar-primary", "--sidebar-primary-foreground",
    "--sidebar-accent", "--sidebar-accent-foreground", "--sidebar-border", "--sidebar-ring"
];

let lastSavedTheme: Record<string, string> = {};
let lastSavedThemeConfig = { hue: 220, saturation: 0.15, lightness: 0.7, mode: "dark" };

export function ThemeCustomizerModal({ children }: { children: React.ReactNode }) {
    const { update } = useSession();
    const [mode, setMode] = React.useState(lastSavedThemeConfig.mode);
    const [hue, setHue] = React.useState(lastSavedThemeConfig.hue);
    const [saturation, setSaturation] = React.useState(lastSavedThemeConfig.saturation);
    const [lightness, setLightness] = React.useState(lastSavedThemeConfig.lightness);
    const [isOpen, setIsOpen] = React.useState(false);

    const generateThemeCss = (h: number, s: number, l: number, m: string): Record<string, string> => {
        const isDark = m === 'dark';
        
        // Cores de fundo e texto principais
        const bgLightness = isDark ? 0.09 : 0.98;
        const fgLightness = isDark ? 0.98 : 0.09;

        // Saturação para os elementos coloridos vs. fundo neutro
        const baseSaturation = s * (isDark ? 0.15 : 0.5);
        const backgroundSaturation = isDark ? 0.03 : 0.01; // Saturação mínima para o fundo

        // Cores primárias e de destaque
        const primaryFgLightness = l > 0.6 ? 0.1 : 0.98;
        const accentLightness = l * (isDark ? 0.6 : 1);
        const accentFgLightness = accentLightness > 0.6 ? 0.1 : 0.98;

        // Variações de brilho e alfa para outros elementos
        const cardBgLightness = isDark ? bgLightness + 0.04 : bgLightness - 0.04;
        const sidebarBgLightness = isDark ? bgLightness + 0.02 : bgLightness - 0.02;
        const mutedFgLightness = isDark ? fgLightness * 0.7 : fgLightness * 1.3;
        const borderAlpha = isDark ? '20%' : '30%';

        return {
            "--background": `oklch(${bgLightness} ${backgroundSaturation} ${h})`,
            "--foreground": `oklch(${fgLightness} ${baseSaturation * 0.5} ${h})`,
            
            "--card": `oklch(${cardBgLightness} ${baseSaturation} ${h})`,
            "--card-foreground": `oklch(${fgLightness} ${baseSaturation} ${h})`,
            
            "--popover": `oklch(${cardBgLightness} ${baseSaturation} ${h})`,
            "--popover-foreground": `oklch(${fgLightness} ${baseSaturation} ${h})`,
            
            "--primary": `oklch(${l} ${s} ${h})`,
            "--primary-foreground": `oklch(${primaryFgLightness} ${s * 0.2} ${h})`,
            
            "--secondary": `oklch(${cardBgLightness} ${baseSaturation * 0.7} ${h})`,
            "--secondary-foreground": `oklch(${fgLightness} ${baseSaturation * 0.8} ${h})`,
            
            "--muted": `oklch(${cardBgLightness} ${baseSaturation * 0.5} ${h})`,
            "--muted-foreground": `oklch(${mutedFgLightness} ${baseSaturation * 0.6} ${h})`,
            
            "--accent": `oklch(${accentLightness} ${s * 0.8} ${h})`,
            "--accent-foreground": `oklch(${accentFgLightness} ${s * 0.2} ${h})`,
            
            "--border": `oklch(${fgLightness} ${baseSaturation * 0.5} ${h} / ${borderAlpha})`,
            "--input": `oklch(${fgLightness} ${baseSaturation * 0.5} ${h} / ${borderAlpha})`,
            "--ring": `oklch(${l} ${s} ${h})`,

            "--sidebar": `oklch(${sidebarBgLightness} ${baseSaturation} ${h})`,
            "--sidebar-foreground": `oklch(${fgLightness} ${baseSaturation} ${h})`,
            "--sidebar-primary": `oklch(${l} ${s} ${h})`,
            "--sidebar-primary-foreground": `oklch(${primaryFgLightness} ${s * 0.2} ${h})`,
            "--sidebar-accent": `oklch(${accentLightness} ${s * 0.8} ${h})`,
            "--sidebar-accent-foreground": `oklch(${accentFgLightness} ${s * 0.2} ${h})`,
            "--sidebar-border": `oklch(${fgLightness} ${baseSaturation * 0.5} ${h} / ${borderAlpha})`,
            "--sidebar-ring": `oklch(${l} ${s} ${h})`,
        };
    };
    
    const applyCss = (css: Record<string, string>) => {
        const root = document.documentElement;
        Object.entries(css).forEach(([prop, value]) => {
            root.style.setProperty(prop, value);
        });
    };
    
    const resetToLastSaved = () => {
        const root = document.documentElement;
        themeProperties.forEach(prop => {
            if (lastSavedTheme[prop]) {
                root.style.setProperty(prop, lastSavedTheme[prop]);
            } else {
                root.style.removeProperty(prop);
            }
        });
    };

    React.useEffect(() => {
        if (isOpen) {
            const previewCss = generateThemeCss(hue, saturation, lightness, mode);
            applyCss(previewCss);
        }
    }, [hue, saturation, lightness, mode, isOpen]);

    const handleSave = async () => {
        try {
            const themeToSave = { hue, saturation, lightness, mode };
            await ky.patch('/api/user/theme', {
                json: themeToSave
            });
            
            await update({ theme: themeToSave });
            
            lastSavedTheme = generateThemeCss(hue, saturation, lightness, mode);
            lastSavedThemeConfig = { hue, saturation, lightness, mode };
            
            toast.success("Tema salvo com sucesso!");
            setIsOpen(false);
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar o tema.");
            console.error(error);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setMode(lastSavedThemeConfig.mode);
            setHue(lastSavedThemeConfig.hue);
            setSaturation(lastSavedThemeConfig.saturation);
            setLightness(lastSavedThemeConfig.lightness);
        } else {
            resetToLastSaved();
        }
        setIsOpen(open);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Personalizar Tema</DialogTitle>
                    <DialogDescription>
                        Ajuste os controles para pré-visualizar o tema. Salve para aplicar.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Modo</Label>
                        <RadioGroup value={mode} onValueChange={setMode} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light">Claro</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark">Escuro</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label>Matiz (Cor)</Label>
                        <Slider value={[hue]} max={360} onValueChange={(v) => setHue(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <Label>Saturação</Label>
                        <Slider value={[saturation]} max={0.3} step={0.01} onValueChange={(v) => setSaturation(v[0])} />
                    </div>
                    <div className="space-y-2">
                        <Label>Brilho (Cor Primária)</Label>
                        <Slider value={[lightness]} max={1} step={0.01} onValueChange={(v) => setLightness(v[0])} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>
                        Salvar Tema
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 