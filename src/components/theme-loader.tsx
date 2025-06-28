'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// Esta função deve ser idêntica à do ThemeCustomizerModal
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

export function ThemeLoader() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session.user?.theme) {
      const { hue, saturation, lightness, mode } = session.user.theme;
      const themeCss = generateThemeCss(hue, saturation, lightness, mode);
      applyCss(themeCss);
    }
  }, [session, status]);

  return null;
} 