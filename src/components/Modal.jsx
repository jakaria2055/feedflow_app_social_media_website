import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const Modal = ({
  openModal,
  onClose,
  children,
  initialWidth = "max-w-md",
  initialHeight = "h-[85vh]",
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
      ></div>

      <button
        onClick={onClose}
        className="absolute top-3 right-4 z-10 text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"
      >
        {" "}
        <X size={28} />{" "}
      </button>

      <div
        className={`relative flex flex-col bg-black/50 rounded-xl overflow-hidden w-[90%] ${initialWidth} ${initialHeight} flex justify-center items-center border border-gray-800 transform transition-all duration-300 ${show ? "opacity-100 translate-y-0 scale-100 ease-out" : "opacity-0 translate-y-0 scale-95 ease-in"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
