import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  handleClick: () => void;
}

export default function Button({ children, handleClick }: ButtonProps) {
  return (
    <button
      onClick={() => handleClick()}
      className="flex items-center bg-stone-50 aspect-square p-1 rounded-full border-border border cursor-pointer text-md 3xl:text-lg 3xl:p-2"
    >
      {children}
    </button>
  );
}
