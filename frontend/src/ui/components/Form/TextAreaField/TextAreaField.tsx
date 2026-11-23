import type { ComponentProps } from "react";
import type { FieldWrapperProps } from "../FieldWrapper/FieldWrapper";
import FieldWrapper from "../FieldWrapper/FieldWrapper";
import type { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaFieldProps
  extends
    Omit<FieldWrapperProps, "children">,
    Omit<ComponentProps<"textarea">, "className" | "id"> {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  registration?: UseFormRegisterReturn;
}

export default function TextAreaField({
  id,
  label,
  colSpan,
  required,
  rows = 2,
  error,
  disabled,
  registration,
}: TextAreaFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      colSpan={colSpan}
      required={required}
      error={error}
    >
      <textarea
        id={id}
        rows={rows}
        {...registration}
        disabled={disabled}
        className="text-d-purple bg-white border border-border p-2 rounded-md text-sm 3xl:text-xl disabled:bg-stone-100"
      />
    </FieldWrapper>
  );
}
