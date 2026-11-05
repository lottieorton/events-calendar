import {
  faBell,
  faCircleExclamation,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

type AlertVariant = "error" | "info";

interface VariantConfig {
  icon: IconDefinition;
  msgPrefix: string;
  role: "alert" | "status";
  container: string;
  iconColor: string;
}

const variants: Record<AlertVariant, VariantConfig> = {
  error: {
    icon: faCircleExclamation,
    msgPrefix: "Error: ",
    role: "alert",
    container: "border-red-200 bg-red-50 text-red-800",
    iconColor: "text-red-600",
  },
  info: {
    icon: faBell,
    msgPrefix: "Information: ",
    role: "status",
    container: "border-secondary/50 bg-bright-pink/30 text-secondary",
    iconColor: "text-secondary/80",
  },
};

interface AlertProps {
  variant: AlertVariant;
  title: string;
  children: ReactNode;
}

export default function Alert({ variant, title, children }: AlertProps) {
  const { icon, msgPrefix, role, container, iconColor } = variants[variant];
  return (
    <div
      role={role}
      className={`flex gap-3 rounded-xl border p-4 text-sm ${container}`}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`mt-0.5 shrink-0 text-base ${iconColor}`}
      />
      <div className="min-w-0">
        <span className="sr-only">{msgPrefix}</span>
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
