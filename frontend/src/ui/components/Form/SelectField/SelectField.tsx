import type { ComponentProps } from "react";
import type { FieldWrapperProps } from "../FieldWrapper/FieldWrapper";
import FieldWrapper from "../FieldWrapper/FieldWrapper";
import type { FormOption } from "../formInterfaces";
import type { UseFormRegisterReturn } from "react-hook-form";

interface SelectFieldProps
  extends
    Omit<FieldWrapperProps, "children">,
    Omit<ComponentProps<"select">, "className" | "id"> {
  id: string;
  label: string;
  options: FormOption[];
  error?: string;
  required?: boolean;
  registration?: UseFormRegisterReturn;
}

export default function SelectField({
  id,
  label,
  options,
  colSpan,
  required,
  error,
  disabled,
  registration,
}: SelectFieldProps) {
  return (
    <FieldWrapper
      id={id}
      label={label}
      colSpan={colSpan}
      required={required}
      error={error}
    >
      <select
        id={id}
        {...registration}
        disabled={disabled}
        className="text-d-purple bg-white border border-border p-2 rounded-md text-sm 3xl:text-xl disabled:bg-stone-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
