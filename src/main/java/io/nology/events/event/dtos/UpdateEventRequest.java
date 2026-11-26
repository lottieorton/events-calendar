package io.nology.events.event.dtos;

import java.time.Instant;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

import org.openapitools.jackson.nullable.JsonNullable;

public record UpdateEventRequest (
    JsonNullable<@Pattern(regexp = ".*\\S.*", message = "Title cannot be empty") String> title,
    JsonNullable<String> description,
    JsonNullable<@Min(1) Long> calendarId,
    JsonNullable<Instant> startAt,
    JsonNullable<Instant> endAt,
    JsonNullable<Boolean> isAllDay
) {}
