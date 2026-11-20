import { useEffect, useRef, type ReactNode } from "react";
import IconButton from "../IconButton/IconButton";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ open, title, children, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    // if dialog element not available yet return
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const onDialogClick = (
    e: React.MouseEvent<HTMLDialogElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      onClick={onDialogClick}
      className="fixed inset-0 m-auto max-h-[calc(100%-3rem)] max-w-2xl w-[calc(100%-3rem)] h-fit overflow-y-auto bg-stone-50 rounded-lg border border-border backdrop:bg-black/50 shadow-card"
    >
      <div className="flex flex-col p-4 gap-2">
        <div className="flex justify-between">
          <h2 className="font-bold text-lg 3xl:text-xl">{title}</h2>
          <IconButton icon={faXmark} label="Close modal" onClick={onClose} />
        </div>
        <div className="pb-1">{children}</div>
      </div>
    </dialog>
  );
}
