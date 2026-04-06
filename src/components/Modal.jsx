import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Modal = ({ open, onOpenChange, children }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger> */}
      <DialogContent className="w-full bg-black p-0 border-none shadow-none overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-[90vh] md:w-[600px] md:h-[90vh] lg:w-[600px] lg:h-[90vh] bg-black overflow-hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
