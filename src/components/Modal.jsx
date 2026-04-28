import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  openModal,
  onClose,
  children,
  showCloseBtn = false,
  initialWidth = "max-w-md",
  initialHeight = "h-[85vh]",
  handlePrev,
  handleNext,
  showBtn,
}) => {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (openModal) {
      setMounted(true);
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [openModal]);

  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Close */}
      {showCloseBtn && (
        <button
          onClick={onClose}
          className="absolute top-3 right-4 z-10 text-gray-400 hover:text-white"
        >
          <X size={28} />
        </button>
      )}

      {showBtn && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 rounded-full bg-white/40 p-2"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 rounded-full bg-white/40 p-2"
          >
            <ArrowRight size={24} />
          </button>
        </>
      )}

      {/* Content */}
      <div
        className={`relative flex flex-col bg-black/50 rounded-xl overflow-hidden w-[90%] ${initialWidth} ${initialHeight} border border-gray-800 transform transition-all duration-300 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {children}
      </div>
    </div>,
    document.body, // 🔥 KEY FIX
  );
};

export default Modal;
