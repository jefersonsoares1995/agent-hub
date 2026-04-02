import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/lib/store";

const THEMES = [
  { id: "cyber", label: "Cyber Teal", color: "hsl(172 66% 50%)", accent: "hsl(260 60% 60%)" },
  { id: "neon-purple", label: "Neon Purple", color: "hsl(280 100% 65%)", accent: "hsl(320 80% 60%)" },
  { id: "sunset", label: "Sunset Fire", color: "hsl(25 95% 55%)", accent: "hsl(350 80% 55%)" },
  { id: "ocean", label: "Ocean Blue", color: "hsl(200 90% 50%)", accent: "hsl(170 70% 45%)" },
  { id: "matrix", label: "Matrix", color: "hsl(142 70% 48%)", accent: "hsl(100 60% 45%)" },
  { id: "rose", label: "Rose Gold", color: "hsl(340 75% 60%)", accent: "hsl(30 60% 55%)" },
] as const;

const ThemeSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Trocar tema"
      >
        <Palette className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-border bg-card p-2 shadow-card backdrop-blur-xl"
          >
            <p className="mb-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tema
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all ${
                  theme === t.id
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className="flex gap-1">
                  <span
                    className="h-4 w-4 rounded-full border border-border/50"
                    style={{ background: t.color }}
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-border/50"
                    style={{ background: t.accent }}
                  />
                </div>
                <span className="font-medium">{t.label}</span>
                {theme === t.id && (
                  <motion.span
                    layoutId="theme-check"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
