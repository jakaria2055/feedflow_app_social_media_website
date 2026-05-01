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
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      {/* Close Button */}
      {showCloseBtn && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all duration-200 hover:scale-110"
        >
          <X size={24} />
        </button>
      )}

      {/* Navigation Buttons */}
      {showBtn && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 p-3 rounded-full transition-all duration-200 hover:scale-110"
          >
            <ArrowRight size={22} />
          </button>
        </>
      )}

      {/* Content */}
      <div
        className={`relative flex flex-col bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden w-[95%] ${initialWidth} ${initialHeight} border border-gray-800/50 shadow-2xl shadow-black/50 transform transition-all duration-300 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;