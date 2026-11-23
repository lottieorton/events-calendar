import { eventFormSchema, type EventFormValues } from "./schema";

const defaults = {
  title: "Test",
  description: "Test description",
  calendarId: 1,
  startAt: "2026-11-12T18:00:00Z",
  endAt: "2026-11-12T19:00:00Z",
  isAllDay: true,
};

const messagesFor = (overrides: Partial<EventFormValues>): string[] => {
  const result = eventFormSchema.safeParse({
    ...defaults,
    ...overrides,
  });
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.message);
};

describe("eventFormSchema", () => {
  it("Should accept a fully filled form", () => {
    const result = eventFormSchema.safeParse({
      title: "Test",
      description: "Test description",
      calendarId: 1,
      startAt: "2026-11-12T18:00:00Z",
      endAt: "2026-11-12T19:00:00Z",
      isAllDay: true,
    });

    expect(result.success).toBe(true);
  });

  it("Should accept a form without description", () => {
    const result = eventFormSchema.safeParse({
      title: "Test",
      calendarId: 1,
      startAt: "2026-11-12T18:00:00Z",
      endAt: "2026-11-12T19:00:00Z",
      isAllDay: false,
    });

    expect(result.success).toBe(true);
  });

  describe("title", () => {
    it("Should be required", () => {
      expect(messagesFor({ title: "" })).toEqual(["Title cannot be empty"]);
    });

    it("Should not just contain whitespace", () => {
      expect(messagesFor({ title: "     " })).toEqual([
        "Title cannot be empty",
      ]);
    });

    it("Should trim value", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        title: "  Messy string  ",
      });
      expect(parsed.title).toBe("Messy string");
    });

    it("Should be maximum 255 characters long", () => {
      expect(
        messagesFor({
          title:
            "This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title.",
        }),
      ).toEqual(["Title must be 255 characters or less"]);
    });
  });

  describe("description", () => {
    it("Should accept empty string", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        description: "",
      });
      expect(parsed.description).toBe(null);
    });

    it("Should convert empty string to null", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        description: "      ",
      });
      expect(parsed.description).toBe(null);
    });

    it("Should trim empty whitespace accept empty string", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        description: "   Test trim    ",
      });
      expect(parsed.description).toBe("Test trim");
    });

    it("Should be maximum 255 characters long", () => {
      expect(
        messagesFor({
          description:
            "This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title. This is testing a very, very, very, incredibly long title.",
        }),
      ).toEqual(["Description must be 255 characters or less"]);
    });
  });

  describe("calendarId", () => {
    it("Should be required", () => {
      expect(messagesFor({ calendarId: undefined })).toEqual([
        "Please select a valid calendar",
      ]);
    });

    it("Should convert a valid category id to a number", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        calendarId: "1",
      });
      expect(parsed.calendarId).toBe(1);
    });

    it("Should allow positive id", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        calendarId: 2,
      });
      expect(parsed.calendarId).toBe(2);
    });

    it("Should reject a negative id", () => {
      expect(messagesFor({ calendarId: -1 })).toEqual([
        "Please select a valid calendar",
      ]);
    });

    it("Should reject 0", () => {
      expect(messagesFor({ calendarId: 0 })).toEqual([
        "Please select a valid calendar",
      ]);
    });
  });

  describe("startAt", () => {
    it("Should be required", () => {
      expect(messagesFor({ startAt: undefined })).toEqual([
        "Please enter a valid date and time",
      ]);
    });

    it("Should convert string to date", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        startAt: "2026-11-20T10:00",
        endAt: "2026-11-20T12:00",
      });
      expect(parsed.startAt).toEqual(new Date(2026, 10, 20, 10, 0, 0));
    });

    it("Should reject invalid datestring", () => {
      expect(messagesFor({ startAt: new Date("invalid date") })).toEqual([
        "Please enter a valid date and time",
      ]);
    });
  });

  describe("endAt", () => {
    it("Should be required", () => {
      expect(messagesFor({ endAt: undefined })).toEqual([
        "Please enter a valid date and time",
      ]);
    });

    it("Should convert string to date", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        startAt: "2026-11-20T10:00",
        endAt: "2026-11-20T12:00",
      });
      expect(parsed.endAt).toEqual(new Date(2026, 10, 20, 12, 0, 0));
    });

    it("Should reject invalid datestring", () => {
      expect(messagesFor({ endAt: new Date("invalid date") })).toEqual([
        "Please enter a valid date and time",
      ]);
    });
  });

  describe("isAllDay", () => {
    it("Should be required", () => {
      expect(messagesFor({ isAllDay: undefined })).toEqual([
        "Invalid input: expected boolean, received undefined",
      ]);
    });

    it("Should accept valid boolean", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        isAllDay: true,
      });
      expect(parsed.isAllDay).toEqual(true);
    });
  });

  describe("Refining", () => {
    it("Should accept date ranges with startAt before endAt when !isAllDay", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        startAt: "2026-11-20T10:00",
        endAt: "2026-11-20T12:00",
        isAllDay: false,
      });
      expect(parsed.endAt).toEqual(new Date(2026, 10, 20, 12, 0, 0));
    });

    it("Should reject date ranges with startAt after endAt when !isAllDay", () => {
      expect(
        messagesFor({
          startAt: new Date(2026, 10, 20, 12, 0, 0),
          endAt: new Date(2026, 10, 20, 10, 0, 0),
          isAllDay: false,
        }),
      ).toEqual(["End at must be after the Start At date and time"]);
    });

    it("Should reject date ranges with startAt equal to endAt when !isAllDay", () => {
      expect(
        messagesFor({
          startAt: new Date(2026, 10, 20, 12, 0, 0),
          endAt: new Date(2026, 10, 20, 12, 0, 0),
          isAllDay: false,
        }),
      ).toEqual(["End at must be after the Start At date and time"]);
    });

    it("Should accept date ranges with startAt before endAt when isAllDay", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        startAt: "2026-11-20T00:00",
        endAt: "2026-11-21T00:00",
        isAllDay: true,
      });
      expect(parsed.startAt).toEqual(new Date(2026, 10, 20, 0, 0, 0));
      expect(parsed.endAt).toEqual(new Date(2026, 10, 21, 0, 0, 0));
    });

    it("Should reject date ranges with startAt after endAt when isAllDay", () => {
      expect(
        messagesFor({
          startAt: new Date(2026, 10, 20, 12, 0, 0),
          endAt: new Date(2026, 10, 20, 10, 0, 0),
          isAllDay: true,
        }),
      ).toEqual(["End at must be after the Start At date and time"]);
    });

    it("Should accept date ranges with startAt equal to endAt when isAllDay", () => {
      const parsed = eventFormSchema.parse({
        ...defaults,
        startAt: "2026-11-20T00:00",
        endAt: "2026-11-20T00:00",
        isAllDay: true,
      });
      expect(parsed.startAt).toEqual(new Date(2026, 10, 20, 0, 0, 0));
      expect(parsed.endAt).toEqual(new Date(2026, 10, 20, 0, 0, 0));
    });
  });
});
