import type { ComponentProps } from "react";
import type { FieldWrapperProps } from "../FieldWrapper/FieldWrapper";
import FieldWrapper from "../FieldWrapper/FieldWrapper";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps
  extends
    Omit<FieldWrapperProps, "children">,
    Omit<ComponentProps<"input">, "className" | "id"> {
  id: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "datetime-local"
    | "password";
  label: string;
  error?: string;
  required?: boolean;
  registration?: UseFormRegisterReturn;
}

export default function InputField({
  id,
  label,
  type = "text",
  colSpan,
  required,
  error,
  disabled,
  registration,
}: InputFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      colSpan={colSpan}
      required={required}
      error={error}
    >
      <input
        id={id}
        type={type}
        {...registration}
        disabled={disabled}
        className="text-d-purple bg-white border border-border p-2 rounded-md text-sm 3xl:text-xl disabled:bg-stone-100"
      />
    </FieldWrapper>
  );
}
