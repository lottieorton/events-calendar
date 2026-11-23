import type { ComponentProps, ReactNode } from "react";

type TextButtonVariant = "primary" | "secondary";

const variantClasses: Record<TextButtonVariant, string> = {
  primary:
    "text-stone-50 bg-secondary hover:bg-secondary/90 disabled:bg-secondary/50",
  secondary:
    "border border-border text-secondary bg-stone-50 hover:bg-stone-100 disabled:bg-gray-200",
};

type SizeVariant = "sm" | "lg";

const sizeClasses: Record<SizeVariant, string> = {
  sm: "rounded-full py-2 px-3 text-sm 3xl:text-lg",
  lg: "rounded-md py-3 px-3 text-sm 3xl:text-lg",
};

interface TextButtonProps extends Omit<ComponentProps<"button">, "className"> {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: TextButtonVariant;
  size?: SizeVariant;
}

export default function TextButton({
  variant = "primary",
  children,
  onClick,
  size = "sm",
  type = "button",
  ...rest
}: TextButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`font-main font-medium cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} disabled:cursor-none`}
      {...rest}
    >
      {children}
    </button>
  );
}
