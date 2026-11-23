import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(255, "Title must be 255 characters or less"),
    description: z
      .string()
      .max(255, "Description must be 255 characters or less")
      .transform((val) => {
        const trimmed = val.trim();
        return trimmed === "" ? null : trimmed;
      })
      .nullable()
      .optional(),
    calendarId: z.coerce
      .number({
        error: () => ({ message: "Please select a valid calendar" }),
      })
      .min(1),
    startAt: z.coerce.date({
      error: () => ({ message: "Please enter a valid date and time" }),
    }),
    endAt: z.coerce.date({
      error: () => ({ message: "Please enter a valid date and time" }),
    }),
    isAllDay: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.isAllDay) {
        return data.startAt < data.endAt;
      } else {
        return data.startAt <= data.endAt;
      }
    },
    {
      message: "End at must be after the Start At date and time",
      path: ["endAt"],
    },
  );

export type EventFormValues = z.output<typeof eventFormSchema>;

export type EventFormInput = z.input<typeof eventFormSchema>;
