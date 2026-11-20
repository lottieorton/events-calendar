package io.nology.events.event.dtos;

import java.time.Instant;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateEventRequest (
    @NotBlank(message = "Title cannot be empty") String title,
    @Pattern(regexp = ".*\\S.*", message = "Description cannot be empty") String description,
    @NotNull(message = "Calendar cannot be empty") @Min(1) Long calendarId,
    @NotNull Instant startAt,
    @NotNull Instant endAt,
    @NotNull Boolean isAllDay
) {}
