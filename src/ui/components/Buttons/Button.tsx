import type { ComponentProps, ReactNode } from "react";

interface ButtonProps extends Omit<ComponentProps<"button">, "className"> {
  children: ReactNode;
  handleClick: () => void;
  type?: "button" | "submit";
}

export default function Button({
  children,
  handleClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      onClick={() => handleClick()}
      type={type}
      className="flex items-center bg-stone-50 aspect-square p-1 rounded-full border-border border cursor-pointer text-md 3xl:text-lg 3xl:p-2 hover:bg-stone-100"
    >
      {children}
    </button>
  );
}
