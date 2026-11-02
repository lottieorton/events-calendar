import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ComponentProps } from "react";

interface IconButtonProps extends Omit<ComponentProps<"button">, "className"> {
  icon: IconProp;
  label: string;
  handleClick: () => void;
  type?: "button" | "submit";
}

export default function IconButton({
  icon,
  label,
  handleClick,
  type = "button",
}: IconButtonProps) {
  return (
    <button
      onClick={() => handleClick()}
      type={type}
      className="flex justify-center items-center bg-stone-50 aspect-square p-1 rounded-full border-border border cursor-pointer text-md 3xl:text-lg 3xl:p-2 hover:bg-stone-100"
    >
      <FontAwesomeIcon icon={icon} aria-label={label} />
    </button>
  );
}
