"use client"

import * as React from "react"
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
let lastSavedHSL = { hue: 220, saturation: 0.15, lightness: 0.7 };

export function ThemeCustomizerModal({ children }: { children: React.ReactNode }) {
    const [hue, setHue] = React.useState(lastSavedHSL.hue);
    const [saturation, setSaturation] = React.useState(lastSavedHSL.saturation);
    const [lightness, setLightness] = React.useState(lastSavedHSL.lightness);
    const [isOpen, setIsOpen] = React.useState(false);

    const generateThemeCss = (h: number, s: number, l: number): Record<string, string> => {
        const bgLightness = 0.15;
        const fgLightness = 0.98;
        const baseSaturation = s * 0.1;
        const primaryFgLightness = l > 0.6 ? 0.1 : 0.98;
        const accentLightness = l * 0.6;
        const accentFgLightness = accentLightness > 0.6 ? 0.1 : 0.98;

        return {
            "--background": `oklch(${bgLightness} ${baseSaturation} ${h})`,
            "--foreground": `oklch(${fgLightness} ${baseSaturation * 1.2} ${h})`,
            "--card": `oklch(${bgLightness + 0.05} ${baseSaturation * 1.5} ${h})`,
            "--card-foreground": `oklch(${fgLightness} ${baseSaturation * 1.2} ${h})`,
            "--popover": `oklch(${bgLightness + 0.05} ${baseSaturation * 1.5} ${h})`,
            "--popover-foreground": `oklch(${fgLightness} ${baseSaturation * 1.2} ${h})`,
            "--primary": `oklch(${l} ${s} ${h})`,
            "--primary-foreground": `oklch(${primaryFgLightness} ${s * 0.2} ${h})`,
            "--secondary": `oklch(${bgLightness + 0.1} ${baseSaturation * 1.2} ${h})`,
            "--secondary-foreground": `oklch(${fgLightness} ${baseSaturation * 1.2} ${h})`,
            "--muted": `oklch(${bgLightness + 0.1} ${baseSaturation * 1.2} ${h})`,
            "--muted-foreground": `oklch(${fgLightness * 0.7} ${baseSaturation} ${h})`,
            "--accent": `oklch(${accentLightness} ${s * 0.8} ${h})`,
            "--accent-foreground": `oklch(${accentFgLightness} ${s * 0.2} ${h})`,
            "--border": `oklch(1 0 0 / 10%)`,
            "--input": `oklch(1 0 0 / 15%)`,
            "--ring": `oklch(${l} ${s} ${h})`,
            "--sidebar": `oklch(${bgLightness + 0.05} ${baseSaturation * 1.5} ${h})`,
            "--sidebar-foreground": `oklch(${fgLightness} ${baseSaturation * 1.2} ${h})`,
            "--sidebar-primary": `oklch(${l} ${s} ${h})`,
            "--sidebar-primary-foreground": `oklch(${primaryFgLightness} ${s * 0.2} ${h})`,
            "--sidebar-accent": `oklch(${accentLightness} ${s * 0.8} ${h})`,
            "--sidebar-accent-foreground": `oklch(${accentFgLightness} ${s * 0.2} ${h})`,
            "--sidebar-border": `oklch(1 0 0 / 10%)`,
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
            const previewCss = generateThemeCss(hue, saturation, lightness);
            applyCss(previewCss);
        }
    }, [hue, saturation, lightness, isOpen]);

    const handleSave = async () => {
        try {
            await ky.patch('/api/user/theme', {
                json: { hue, saturation, lightness }
            });
            
            lastSavedTheme = generateThemeCss(hue, saturation, lightness);
            lastSavedHSL = { hue, saturation, lightness };
            
            toast.success("Tema salvo com sucesso!");
            setIsOpen(false);
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar o tema.");
            console.error(error);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setHue(lastSavedHSL.hue);
            setSaturation(lastSavedHSL.saturation);
            setLightness(lastSavedHSL.lightness);
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