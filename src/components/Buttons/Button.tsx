import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
}

export default function Button({ children }: ButtonProps) {
  return (
    <button className="bg-stone-50 p-1 rounded-full border-[#EEDDE1] border">
      {children}
    </button>
  );
}
