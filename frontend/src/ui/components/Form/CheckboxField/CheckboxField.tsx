import type { ComponentProps } from "react";
import type { FieldWrapperProps } from "../FieldWrapper/FieldWrapper";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CheckboxFieldProps
  extends
    Omit<FieldWrapperProps, "children">,
    Omit<ComponentProps<"input">, "className" | "id"> {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  registration?: UseFormRegisterReturn;
}

export default function CheckboxField({
  id,
  label,
  checked,
  colSpan,
  required,
  error,
  disabled,
  registration,
}: CheckboxFieldProps) {
  return (
    <div className={`flex items-center py-2 gap-3 ${colSpan}`}>
      <label
        htmlFor={id}
        className="font-main text-sm text-pale-purple 3xl:text-xl"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        {...registration}
        className="accent-secondary h-4 w-4 cursor-pinter disabled:cursor-not-allowed"
      />
      {error && (
        <span className="text-xs text-rose-500 3xl:text-lg">{error}</span>
      )}
    </div>
  );
}
