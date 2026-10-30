import type { ComponentProps, ReactNode } from "react";

type TextButtonVariant = "primary" | "secondary";

const variantClasses: Record<TextButtonVariant, string> = {
  primary: "text-stone-50 bg-secondary hover:bg-secondary/90",
  secondary:
    "border border-border text-secondary bg-stone-50 hover:bg-stone-100",
};

interface TextButtonProps extends Omit<ComponentProps<"button">, "className"> {
  children: ReactNode;
  handleClick: () => void;
  type?: "button" | "submit";
  variant?: TextButtonVariant;
}

export default function TextButton({
  variant = "primary",
  children,
  handleClick,
  type = "button",
}: TextButtonProps) {
  return (
    <button
      onClick={() => handleClick()}
      type={type}
      className={`rounded-full py-2 px-3 text-sm font-medium cursor-pointer 3xl:text-lg ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
