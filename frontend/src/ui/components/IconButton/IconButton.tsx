import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ComponentProps } from "react";

export type IconButtonVariant = "primary" | "secondary";

const variantClasses: Record<IconButtonVariant, string> = {
  primary: "bg-stone-50 hover:bg-stone-100",
  secondary: "bg-secondary text-stone-50 hover:bg-secondary:90",
};

interface IconButtonProps extends Omit<ComponentProps<"button">, "className"> {
  icon: IconProp;
  label: string;
  onClick: () => void;
  type?: "button" | "submit";
  variant?: IconButtonVariant;
}

export default function IconButton({
  icon,
  label,
  onClick,
  type = "button",
  variant = "primary",
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      onClick={() => onClick()}
      type={type}
      className={`flex justify-center items-center ${variantClasses[variant]} aspect-square p-1 rounded-full border-border border cursor-pointer text-md 3xl:text-lg 3xl:p-2`}
      aria-label={label}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
