import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useToastStore } from "../lib/toastStore";

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={() => dismiss(toast.id)}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/95 px-4 py-2.5 text-sm font-semibold text-ink-100 shadow-xl backdrop-blur"
          >
            <CheckCircle2 size={16} className="shrink-0 text-accent-400" />
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
