import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import CheckboxField from "../../../../ui/components/Form/CheckboxField/CheckboxField";
import InputField from "../../../../ui/components/Form/InputField/InputField";
import SelectField from "../../../../ui/components/Form/SelectField/SelectField";
import TextAreaField from "../../../../ui/components/Form/TextAreaField/TextAreaField";
import TextButton from "../../../../ui/components/TextButton/TextButton";
import type { EventFormInput, EventFormValues } from "./schema";
import { useCalendars } from "../../../calendars/hooks/calendar-hooks";
import Alert from "../../../../ui/components/Alert/Alert";
import Spinner from "../../../../ui/components/Spinner/Spinner";
import { getEndOfDay, getStartOfDay } from "../../../../lib/utils/date-utils";
import { useEffect, useRef } from "react";

interface EventFormProps {
  methods: UseFormReturn<EventFormInput, any, EventFormValues>;
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const isAllDay = methods.watch("isAllDay");

  const timeCache = useRef({
    start: "00:00",
    end: "01:00",
  });

  useEffect(() => {
    const { startAt: currentStart, endAt: currentEnd } = methods.getValues();

    if (typeof currentStart !== "string" || typeof currentEnd !== "string")
      return;

    if (isAllDay && currentStart.includes("T")) {
      timeCache.current.start = currentStart.split("T")[1];
      timeCache.current.end = currentEnd.split("T")[1];
      methods.setValue("startAt", currentStart.split("T")[0]);
      methods.setValue("endAt", currentEnd.split("T")[0]);
    } else if (!isAllDay && !currentStart.includes("T")) {
      methods.setValue("startAt", `${currentStart}T${timeCache.current.start}`);
      methods.setValue("endAt", `${currentEnd}T${timeCache.current.end}`);
    }
  }, [isAllDay, methods]);

  const onFormSubmit: SubmitHandler<EventFormValues> = async (d) => {
    const finalData = { ...d };

    if (d.isAllDay) {
      const startAtDateTime = getStartOfDay(new Date(finalData.startAt));
      const endAtDateTime = getEndOfDay(new Date(finalData.endAt));
      finalData.startAt = startAtDateTime;
      finalData.endAt = endAtDateTime;
    }

    await onSubmit(finalData);
  };

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
          type={isAllDay ? "date" : "datetime-local"}
          label="Start At"
          required
          registration={register("startAt")}
          error={errors.startAt?.message}
        />
        <InputField
          id="endAt"
          type={isAllDay ? "date" : "datetime-local"}
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
