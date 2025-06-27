'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// Esta função deve ser idêntica à do ThemeCustomizerModal
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

export function ThemeLoader() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session.user?.theme) {
      const { hue, saturation, lightness } = session.user.theme;
      const themeCss = generateThemeCss(hue, saturation, lightness);
      applyCss(themeCss);
    }
  }, [session, status]);

  return null;
} 