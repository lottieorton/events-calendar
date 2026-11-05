import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ComponentProps } from "react";

interface IconButtonProps extends Omit<ComponentProps<"button">, "className"> {
  icon: IconProp;
  label: string;
  onClick: () => void;
  type?: "button" | "submit";
}

export default function IconButton({
  icon,
  label,
  onClick,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      onClick={() => onClick()}
      type={type}
      className="flex justify-center items-center bg-stone-50 aspect-square p-1 rounded-full border-border border cursor-pointer text-md 3xl:text-lg 3xl:p-2 hover:bg-stone-100"
      aria-label={label}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
