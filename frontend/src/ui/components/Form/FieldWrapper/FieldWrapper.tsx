import type { ReactNode } from "react";

export interface FieldWrapperProps {
  id?: string;
  label: string;
  colSpan?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export default function FieldWrapper({
  id,
  label,
  colSpan,
  error,
  required,
  children,
}: FieldWrapperProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${colSpan}`}>
      <label
        htmlFor={id}
        className="font-main text-sm text-pale-purple 3xl:text-xl"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-rose-500 3xl:text-lg">{error}</span>
      )}
    </div>
  );
}
