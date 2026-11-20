import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import CheckboxField from "../../../../ui/components/Form/CheckboxField/CheckboxField";
import InputField from "../../../../ui/components/Form/InputField/InputField";
import SelectField from "../../../../ui/components/Form/SelectField/SelectField";
import TextAreaField from "../../../../ui/components/Form/TextAreaField/TextAreaField";
import TextButton from "../../../../ui/components/TextButton/TextButton";
import type { EventFormValues } from "./schema";
import { useCalendars } from "../../../calendars/hooks/calendar-hooks";
import Alert from "../../../../ui/components/Alert/Alert";
import Spinner from "../../../../ui/components/Spinner/Spinner";

interface EventFormProps {
  methods: UseFormReturn<EventFormValues>;
  submitLabel: string;
  onSubmit: (formData: EventFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EventForm({
  methods,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting,
}: EventFormProps) {
  const { data: calendars = [], isLoading, isError } = useCalendars();

  const opts = calendars.map((c) => {
    return {
      label: c.name,
      value: c.id,
    };
  });

  const onFormSubmit: SubmitHandler<EventFormValues> = async (d) => {
    await onSubmit(d);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  if (isError) {
    return (
      <Alert variant="error" title="Failed to fetch form">
        Issue fetching this form
      </Alert>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-4 w-full p-2"
    >
      <div className="grid grid-cols-2 gap-2 w-full">
        <InputField
          id="title"
          label="Title"
          required
          registration={register("title")}
          error={errors.title?.message}
        />
        <SelectField
          id="calendarId"
          label="Calendar"
          options={opts}
          required
          registration={register("calendarId")}
          error={errors.calendarId?.message}
        />
        <TextAreaField
          id="description"
          label="Description"
          colSpan="col-span-2"
          registration={register("description")}
          error={errors.description?.message}
        />
        <InputField
          id="startAt"
          type="datetime-local"
          label="Start At"
          required
          registration={register("startAt")}
          error={errors.startAt?.message}
        />
        <InputField
          id="endAt"
          type="datetime-local"
          label="End At"
          required
          registration={register("endAt")}
          error={errors.endAt?.message}
        />
        <CheckboxField
          id="isAllDay"
          label="All-day"
          colSpan="col-span-2"
          registration={register("isAllDay")}
          error={errors.isAllDay?.message}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <TextButton type="submit" size="lg" disabled={isSubmitting}>
          {submitLabel}
        </TextButton>
        <TextButton variant="secondary" size="lg" onClick={onCancel}>
          Cancel
        </TextButton>
      </div>
    </form>
  );
}
