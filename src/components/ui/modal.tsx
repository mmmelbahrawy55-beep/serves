import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

const Modal = ({ isOpen, onClose, title, description, children, className }: ModalProps) => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg",
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="space-y-1 flex-1">
                {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
                {description && <p className="text-sm text-gray-500">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
Modal.displayName = "Modal";

export { Modal };
export type { ModalProps };
