import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  handleClick: () => void;
}

export default function Button({ children, handleClick }: ButtonProps) {
  return (
    <button
      onClick={() => handleClick()}
      className="bg-stone-50 p-1 rounded-full border-[#EEDDE1] border cursor-pointer"
    >
      {children}
    </button>
  );
}
