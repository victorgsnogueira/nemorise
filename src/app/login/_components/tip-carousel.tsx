"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const tips = [
  {
    title: "Monitore seus gastos diários.",
    description: "Saber para onde seu dinheiro vai é o primeiro passo para o controle financeiro.",
  },
  {
    title: "Crie categorias personalizadas.",
    description: "Organize suas despesas da forma que fizer mais sentido para você.",
  },
  {
    title: "Defina metas de economia.",
    description: "Estabeleça objetivos claros para suas economias e acompanhe seu progresso.",
  },
  {
    title: "Use relatórios visuais.",
    description: "Nossos gráficos ajudam a entender suas finanças de uma maneira rápida e intuitiva.",
  },
];

export function TipCarousel() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-4 h-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold leading-tight text-white">
            {tips[currentTip].title}
          </h2>
          <p className="text-lg text-slate-400">
            {tips[currentTip].description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 